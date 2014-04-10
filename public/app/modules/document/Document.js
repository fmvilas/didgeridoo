"use strict";
define([
	'require',
	'text!./Document.html',
	'API.Shortcut',
	'API.Event',
	'layout'
], function(require, html) {

	var moduleName = 'Document',
		typeClass,
		mode;

	didgeridoo.api.shortcut.register('Alt+W', 'FileClose');
	didgeridoo.api.shortcut.register('Alt+Shift+W', 'FileCloseAll');

	if( didgeridoo.api.util.system.OS === 'Mac' ) {
		didgeridoo.api.shortcut.register('Cmd+S', 'FileSave');
		didgeridoo.api.shortcut.register('Cmd+Shift+S', 'FileSaveAs');
	} else {
		didgeridoo.api.shortcut.register('Ctrl+S', 'FileSave');
		didgeridoo.api.shortcut.register('Ctrl+Shift+S', 'FileSaveAs');
	}

	var Document = function(type) {

		//It forces to instantiate the class
		if ( !(this instanceof Document) )
			return new Document();

		var _id = 'document' + new Date().getTime(),
			_state = 'closed',
			_url,
			_title = '',
			_designer = null,
	        _codeview = null;

		//Initialize
		didgeridoo.documents = didgeridoo.documents || {};

		switch( type ) {
			case 'HTML':
                typeClass = 'html-document';
                mode = 'text/html';
            break;

            case 'CSS':
            	typeClass = 'css-document';
                mode = 'text/css';
            break;

            case 'JS':
            	typeClass = 'js-document';
                mode = 'text/javascript';
            break;

            case 'JAVA':
            	typeClass = 'java-document';
                mode = 'text/x-java';
            break;

            case 'PHP':
				typeClass = 'php-document';
				mode = 'application/x-httpd-php';
			break;

			default:
				typeClass = 'plain-text-document';
				mode = 'text/plain';
			break;
        }

		//Events
		didgeridoo.api.event.subscribe('Document.change', function(documentId) {
			var doc = didgeridoo.documents[documentId];

			if( doc ) {
				this.setState( doc.getCodeView().getEditor().isClean() ? 'loaded' : 'dirty' );
			}

			if( this.getState() === 'dirty' ) {

			}
		});

		this.close = function() {
			didgeridoo.api.action.do('FileClose', _id);
		};

		this.getId = function() {
			return _id;
		};

		this.getState = function() {
			return _state;
		};

		this.setState = function(newState) {
			var _oldState = _state;
			_state = newState;
			didgeridoo.api.event.publish('Document.state.change', {
				oldState: _oldState,
				newState: newState
			});
		};

		this.getURL = function() {
			return _url ? _url.substring(('/p/'+didgeridoo.api.project.currentProject._id+'/f').length) : _url;
		};

		this.setURL = function(newURL) {
			_url = newURL;
		};

		this.getTitle = function() {
			return _title;
		};

		this.setTitle = function(newTitle) {
			_title = newTitle;
		};
    		
        this.getDesigner = function() {
            return _designer;
        };

        this.setDesigner = function(newDesigner) {
            _designer = newDesigner;
        };
    		
        this.getCodeView = function() {
            return _codeview;
        };

        this.setCodeView = function(newCodeView) {
            _codeview = newCodeView;
        };

        this.mutateTo = function(newMode) {
        	console.log('TODO: Mutate to ' + newMode + ' mode.');
        };

        if( typeof didgeridoo.documents[this.getId()] === 'undefined' ) {
            didgeridoo.documents[this.getId()] = this;
        }

	};

	Document.prototype.save = function(url) {
        if( typeof url === 'undefined' ) {
            if( typeof (url = this.getURL()) === 'undefined' ) {
                didgeridoo.api.action.do('FileSaveAsDialog');
                return;
            }
        }

        this.getCodeView().save(url);

        if( mode !== _getModeFromURL(url) ) {
        	this.mutateTo( _getModeFromURL(url) );
        }
    };

    Document.prototype.load = function(url, callback) {
    	if( arguments.length > 0 ) {
	        this.setTitle( url.lastIndexOf('/') != -1 ? url.substr(url.lastIndexOf('/')+1) : url );
	        this.setURL( url );
	        this.setState( 'loaded' );
	    } else {
	    	this.setTitle( 'Untitled' );
        	this.setState( 'loaded' );
	    }

        var _id = this.getId(),
            _title = this.getTitle(),
            _this = this;
            
        if( typeof didgeridoo.documents[_id] === 'undefined' ) {
            didgeridoo.documents[_id] = this;
        }

        //Create new tab
        //$(didgeridoo.layout.centerPanel).tabs( 'add', '#' + _id, _title );
        didgeridoo.layout.centerPanelTabs.add(_id, _title, _.template(html, {
            id: _id,
            state: this.getState(),
            url: this.getURL(),
            title: _title
        }));


        var $docWrapper = $('#' + _id),
            $docContainer = $('.didgeridoo-document-container', $docWrapper),
            $designerContainer = $('.designer-container', $docContainer),
            $codeviewContainer = $('.codeview-container', $docContainer);

        $docWrapper.addClass(typeClass);
        
        if( mode === 'text/html' ) {
        	require(['modules/designer/main'], function(Designer) {
	            _this.setDesigner( new Designer(_id) );
	                
	            didgeridoo.layout.centerPanelTabs.select(_id);
	            _this.getDesigner().renderTo($designerContainer[0], function() {
	                _this.getDesigner().loadURL(url, function() {
	                    didgeridoo.api.event.publish(moduleName + '.document.load', _id);                        
	                });
	            });
	        });
        }
        
        require(['modules/codeview/main'], function(CodeView) {
            _this.setCodeView( new CodeView(_id) );
                
            didgeridoo.layout.centerPanelTabs.select(_id);
            _this.getCodeView().renderTo($codeviewContainer[0], function() {
            	if( url ) {
            		this.load(url, mode, function() {
	                    _this.setState('loaded');
	                });
            	}
            });
        });
        
        $('#' + _id).on('click', '.btn.codeview', function() {
            
            if( $docContainer.hasClass('codeview') ) {
                $docContainer.removeClass('codeview').addClass('designer');
            } else {
                $docContainer.removeClass('designer').addClass('codeview');
            }
                
        });

        if( typeof callback === 'function') callback(_this);
        
        didgeridoo.api.event.publish(moduleName + '.rendered');
    };

    var _getModeFromURL = function(url) {
    	if( url.match(/(\.html)|(\.htm)$/g) ) {
			mode = 'text/html';
		} else if( url.match(/\.css$/g) ) {
			mode = 'text/css';
		} else if( url.match(/\.js$/g) ) {
			mode = 'text-javascript';
		} else if( url.match(/\.php$/g) ) {
			mode = 'application/x-httpd-php';
		} else if( url.match(/\.java$/g) ) {
			mode = 'text/x-java';
		} else {
			mode = 'text/plain'
		}

		return mode;
    };

	/*
	 * TODO:
	 * -----
	 * Create a DocumentTab Interface and DocumentTabs collection for managing tabs properly
	 *
	 */
	var DocumentTabs = (function() {

	})();

	var DocumentTab = function(documentId, title) {
		//It forces to instantiate the class
		if ( !(this instanceof DocumentTab) )
			return new DocumentTab();

		var _title = title || 'Untitled',
			_domRef;

		$(didgeridoo.layout.centerPanel).tabs( 'add', '#' + documentId, _title );
	};


	return Document;

}); //end of define
