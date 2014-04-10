"use strict";
define([
'require',
'text!./main.html',
'API.Event',
'codemirror'
], function(require, html) {
	
	var moduleName = 'CodeView';	
	
	var CodeView = function(documentId, documentType) {
		//It forces to instantiate the class
      	if ( !(this instanceof CodeView) )
      		return new CodeView();
      	
      	var _instance = this,
      		_rendered = false,
      		_editor;
		
		var _renderTo = function(selector, callback) {
			assert(	typeof selector === 'string' ||
					typeof selector === 'object',
					'Error in module CodeView.\n' +
					'CodeView._renderTo(selector[, callback]): "selector" must be a String or an Object.');
			
			assert(	typeof callback === 'function' ||
					typeof callback === 'undefined',
					'Error in module CodeView.\n' +
					'CodeView._renderTo(selector[, callback]): "callback" is not a Function.');
					
			
			var _id = documentId + '-codeview',
				APP_DIR = didgeridoo.APP_DIR + '/';
			
			$(selector).append(_.template(html, {
				id: _id
			}));
			
			_editor = CodeMirror.fromTextArea( $('#' + _id)[0], {
				mode: documentType || 'text/plain',
				indentWithTabs: true,
				lineNumbers: true,
    			lineWrapping: true,
    			theme: 'monokai'
			});

			_editor.on('change', function() {
				didgeridoo.api.event.publish(moduleName + '.change', documentId);
			});
			
			_rendered = true;
			didgeridoo.api.event.publish(moduleName + '.rendered', _instance);
			
			if(callback) {
				callback.call(this);
			}
			
			return _instance;
		};
		
		
		
		var _load = function(url, mode, callback) {
			
			assert(	_rendered === true,
					'Error in module CodeView.\n' +
					'CodeView._load(url[, mode[, callback]]): The module must be rendered before performing any operation.');
			
			assert(	typeof url === 'string',
					'Error in module CodeView.\n' +
					'CodeView._load(url[, mode[, callback]]): "url" must be a String.');
			
			assert(	typeof mode === 'string' ||
					typeof mode === 'undefined',
					'Error in module CodeView.\n' +
					'CodeView._load(url[, mode[, callback]]): "mode" must be a String.');

			assert(	typeof callback === 'function' ||
					typeof callback === 'undefined',
					'Error in module CodeView.\n' +
					'CodeView._load(url[, mode[, callback]]): "callback" must be a Function.');
					
			
			$.ajax({
				url: url,
				dataType: 'text', //Important! This prevents jQuery from interpreting scripts
				success: function(code, status, request) {
					_editor.setValue(code);
					if( typeof mode === 'string' ) {
						_editor.setOption('mode', mode);
					}
					callback();
				},
				error: function(jqXHR, status, errorThrown) {
					didgeridoo.logger.warn('Oops! Didgeridoo couldn\'t load the "' + url + '" file at CodeView._load(url[, mode]).\n'+
											'Error details:\n  Status Text: ' + status + '\n  Error Thrown: ' + errorThrown);


					// TODO: Replace by a modal window requesting for login.
					// -----------------------------------------------------
					// It could be something like:
					//
					// require(['modules/error/401'], function(error) {
					// 		error.showLoginForm();
					// });
					alert('Error');
				}
			});
			
		};

		var _save = function(url) {
			if( typeof url === 'undefined' ||
				url === null ) {
				return;	
			}

			$.ajax({
				url: '/p/' + didgeridoo.api.project.currentProject._id + '/f' + url,
				type: 'POST',
				data: {
					body: _editor.getValue(),
					authenticity_token: didgeridoo.authenticityToken
				},
				success: function(data) {
					console.log(data);
				},
				error: function(jqXHR, textStatus) {
					console.log(jqXHR.responseText);
				}
			});
		}
		
				
		return {
			load: _load,
			save: _save,
			renderTo: _renderTo,
			getEditor: function() {
				return _editor;
			}
		};
		
	};
	
	
	return CodeView;
	
});