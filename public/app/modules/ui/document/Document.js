"use strict";
define(['require',
'text!./Document.html',
'modules/ui/layout/layout'], function(require, html) {

	var moduleName = 'Document',
		cssFile = require.toUrl('./Document.css'),
		typeClass,
		mode;

	didgeridoo.shortcut.register('Alt+W', 'FileClose');
	didgeridoo.shortcut.register('Alt+Shift+W', 'FileCloseAll');

	if( didgeridoo.system.OS === 'Mac' ) {
		didgeridoo.shortcut.register('Cmd+S', 'FileSave');
		didgeridoo.shortcut.register('Cmd+Shift+S', 'FileSaveAsDialog');
	} else {
		didgeridoo.shortcut.register('Ctrl+S', 'FileSave');
		didgeridoo.shortcut.register('Ctrl+Shift+S', 'FileSaveAsDialog');
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
		didgeridoo.observer.subscribe('Document.change', function(documentId) {
			var doc = didgeridoo.documents[documentId];

			if( doc ) {
				this.setState( doc.getCodeView().getEditor().isClean() ? 'loaded' : 'dirty' );
			}

			if( this.getState() === 'dirty' ) {

			}
		});

		this.close = function() {
			didgeridoo.Action.do('FileClose', _id);
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
			didgeridoo.observer.publish('Document.state.change', {
				oldState: _oldState,
				newState: newState
			});
		};

		this.getURL = function() {
			return _url ? _url.substring(('/p/'+didgeridoo.currentProject+'/f').length) : _url;
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
                didgeridoo.Action.do('FileSaveAsDialog');
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
        
        //Render HTML
        $.tmpl( html, {
            id: _id,
            state: this.getState(),
            url: this.getURL(),
            title: _title
        } ).appendTo( didgeridoo.layout.getCenterPanel() );

        //Load CSS
        didgeridoo.utils.loadCSS(cssFile);

        //Create new tab
        $(didgeridoo.layout.getCenterPanel()).tabs( 'add', '#' + _id, _title );


        var $docWrapper = $('#' + _id),
            $docContainer = $('.didgeridoo-document-container', $docWrapper),
            $designerContainer = $('.designer-container', $docContainer),
            $codeviewContainer = $('.codeview-container', $docContainer);

        $docWrapper.addClass(typeClass);
        
        if( mode === 'text/html' ) {
        	require(['modules/ui/designer/main'], function(Designer) {
	            _this.setDesigner( new Designer(_id) );
	                
	            $(didgeridoo.layout.getCenterPanel()).tabs( 'select', '#' + _id );
	            _this.getDesigner().renderTo($designerContainer[0], function() {
	                _this.getDesigner().loadURL(url, function() {
	                    didgeridoo.observer.publish(moduleName + '.document.load', _id);                        
	                });
	            });
	        });
        }
        
        require(['modules/ui/codeview/main'], function(CodeView) {
            _this.setCodeView( new CodeView(_id) );
                
            $(didgeridoo.layout.getCenterPanel()).tabs( 'select', '#' + _id );
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
        
        didgeridoo.observer.publish(moduleName + '.rendered');
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

		$(didgeridoo.layout.getCenterPanel()).tabs( 'add', '#' + documentId, _title );
	};


	return Document;

}); //end of define
