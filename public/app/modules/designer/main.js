"use strict";
define([
'require',
'text!./main.html',
'API.Event'
], function(require, html) {

    var moduleName = 'Designer',
        handlerURL = require.toUrl('./handler.html');


    var Designer = function(documentId) {
        if ( !(this instanceof Designer) )
            return new Designer();

        assert( typeof documentId === 'string' &&
            typeof didgeridoo.documents[documentId] === 'object',
            'Error. Didgeridoo could not initialize the Designer instance.' );

        var $container,
        $blocker,
        $content,
        $handle,
        content = {
            loaded: false,
            window: null,
            document: null,
            html: null,
            body: null
        },
        handler = {
            loaded: false,
            window: null,
            document: null,
            html: null,
            body: null,
            scrollLeft: 0,
            scrollTop: 0
        },
        selectedElement = null,
        editing = false,
        styles = [
        /*'background-attachment',
						'background-clip',
						'background-color',
						'background-image',
						'background-origin',
						'background-position',
						'background-repeat',
						'background-size',
						'border-bottom-color',
						'border-bottom-left-radius',
						'border-bottom-right-radius',
						'border-bottom-style',*/
        'border-bottom-width',
        'border-collapse',
        'border-image-outset',
        'border-image-repeat',
        'border-image-slice',
        //'border-image-source',
        'border-image-width',
        //'border-left-color',
        //'border-left-style',
        'border-left-width',
        //'border-right-color',
        //'border-right-style',
        'border-right-width',
        //'border-top-color',
        //'border-top-left-radius',
        //'border-top-right-radius',
        //'border-top-style',
        'border-top-width',
        'bottom',
        //'box-shadow',
        'box-sizing',
        'caption-side',
        'clear',
        'clip',
        //'color', Maybe yes?
        //'cursor',
        'direction',
        'display',
        'empty-cells',
        'float',
        'font-family',
        'font-size',
        'font-style',
        'font-variant',
        'font-weight',
        'height',
        'image-rendering',
        'left',
        'letter-spacing',
        'line-height',
        'list-style-image',
        'list-style-position',
        'list-style-type',
        'margin-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'max-height',
        'max-width',
        'min-height',
        'min-width',
        //'opacity',
        'orphans',
        //'outline-color',
        //'outline-style',
        //'outline-width',
        'overflow-x',
        'overflow-y',
        'padding-bottom',
        'padding-left',
        'padding-right',
        'padding-top',
        'page-break-after',
        'page-break-before',
        'page-break-inside',
        'pointer-events',
        'position',
        //'resize',
        'right',
        'speak',
        'table-layout',
        'text-align',
        'text-decoration',
        'text-indent',
        //'text-rendering',
        //'text-shadow',
        'text-overflow',
        'text-transform',
        'top',
        'unicode-bidi',
        'vertical-align',
        //'visibility',
        'white-space',
        'widows',
        'width',
        'word-break',
        'word-spacing',
        'word-wrap',
        'z-index',
        'zoom',
        /*'-webkit-animation-delay',
						'-webkit-animation-direction',
						'-webkit-animation-duration',
						'-webkit-animation-fill-mode',
						'-webkit-animation-iteration-count',
						'-webkit-animation-name',
						'-webkit-animation-play-state',
						'-webkit-animation-timing-function',
						'-webkit-appearance',
						'-webkit-backface-visibility',
						'-webkit-background-clip',
						'-webkit-background-composite',
						'-webkit-background-origin',
						'-webkit-background-size',*/
        '-webkit-border-fit',
        '-webkit-border-horizontal-spacing',
        //'-webkit-border-image',
        '-webkit-border-vertical-spacing',
        '-webkit-box-align',
        '-webkit-box-direction',
        '-webkit-box-flex',
        '-webkit-box-flex-group',
        '-webkit-box-lines',
        '-webkit-box-ordinal-group',
        '-webkit-box-orient',
        '-webkit-box-pack',
        /*'-webkit-box-reflect',
						'-webkit-box-shadow',
						'-webkit-color-correction',*/
        '-webkit-column-break-after',
        '-webkit-column-break-before',
        '-webkit-column-break-inside',
        '-webkit-column-axis',
        '-webkit-column-count',
        '-webkit-column-gap',
        '-webkit-column-rule-color',
        '-webkit-column-rule-style',
        '-webkit-column-rule-width',
        '-webkit-column-span',
        '-webkit-column-width',
        '-webkit-flex-order',
        '-webkit-flex-pack',
        '-webkit-flex-align',
        '-webkit-flex-item-align',
        '-webkit-flex-direction',
        '-webkit-flex-flow',
        '-webkit-flex-line-pack',
        '-webkit-flex-wrap',
        '-webkit-font-kerning',
        '-webkit-font-smoothing',
        '-webkit-font-variant-ligatures',
        '-webkit-highlight',
        '-webkit-hyphenate-character',
        '-webkit-hyphenate-limit-after',
        '-webkit-hyphenate-limit-before',
        '-webkit-hyphenate-limit-lines',
        '-webkit-hyphens',
        '-webkit-line-align',
        '-webkit-line-box-contain',
        '-webkit-line-break',
        '-webkit-line-clamp',
        '-webkit-line-grid',
        '-webkit-line-snap',
        '-webkit-locale',
        '-webkit-margin-before-collapse',
        '-webkit-margin-after-collapse',
        '-webkit-marquee-direction',
        '-webkit-marquee-increment',
        '-webkit-marquee-repetition',
        '-webkit-marquee-style',
        '-webkit-mask-attachment',
        '-webkit-mask-box-image',
        '-webkit-mask-box-image-outset',
        '-webkit-mask-box-image-repeat',
        '-webkit-mask-box-image-slice',
        '-webkit-mask-box-image-source',
        '-webkit-mask-box-image-width',
        '-webkit-mask-clip',
        '-webkit-mask-composite',
        '-webkit-mask-image',
        '-webkit-mask-origin',
        '-webkit-mask-position',
        '-webkit-mask-repeat',
        '-webkit-mask-size',
        '-webkit-nbsp-mode',
        '-webkit-overflow-scrolling',
        '-webkit-perspective',
        '-webkit-perspective-origin',
        '-webkit-print-color-adjust',
        '-webkit-rtl-ordering',
        '-webkit-tap-highlight-color',
        '-webkit-text-combine',
        '-webkit-text-decorations-in-effect',
        '-webkit-text-emphasis-color',
        '-webkit-text-emphasis-position',
        '-webkit-text-emphasis-style',
        //'-webkit-text-fill-color',
        '-webkit-text-orientation',
        '-webkit-text-security',
        '-webkit-text-stroke-color',
        '-webkit-text-stroke-width',
        '-webkit-transform',
        '-webkit-transform-origin',
        '-webkit-transform-style',
        /*'-webkit-transition-delay',
						'-webkit-transition-duration',
						'-webkit-transition-property',
						'-webkit-transition-timing-function',
						'-webkit-user-drag',
						'-webkit-user-modify',
						'-webkit-user-select',*/
        '-webkit-writing-mode',
        '-webkit-flow-into',
        '-webkit-flow-from',
        '-webkit-region-overflow',
        '-webkit-region-break-after',
        '-webkit-region-break-before',
        '-webkit-region-break-inside',
        '-webkit-wrap-flow',
        '-webkit-wrap-margin',
        '-webkit-wrap-padding',
        '-webkit-wrap-through',
        /*'clip-path',
						'clip-rule',
						'mask',
						'filter',
						'flood-color',
						'flood-opacity',
						'lighting-color',
						'stop-color',
						'stop-opacity',
						'color-interpolation',
						'color-interpolation-filters',
						'color-rendering',
						'fill',
						'fill-opacity',
						'fill-rule',
						'marker-end',
						'marker-mid',
						'marker-start',
						'shape-rendering',
						'stroke',
						'stroke-dasharray',
						'stroke-dashoffset',
						'stroke-linecap',
						'stroke-linejoin',
						'stroke-miterlimit',
						'stroke-opacity',
						'stroke-width',
						'alignment-baseline',
						'baseline-shift',
						'dominant-baseline',
						'kerning',
						'text-anchor',
						'writing-mode',
						'glyph-orientation-horizontal',
						'glyph-orientation-vertical',
						'-webkit-svg-shadow',
						'vector-effect'*/
        ];


        var Wireframe = (function() {

            var _dom2box = function(element) {
                var box;

                if(element.tagName === 'BR') {
                    return document.createElement('BR');
                }

                if(element.nodeType === 1) {
                    box = document.createElement('DIV');

                    _setHandlerStyle(box, element, styles);
                    box.setAttribute('spellcheck', 'false');
                    box.classList.add('element');
                    box.addEventListener('scroll', function(ev) {
                        $(ev.target).data('originalElement').scrollTop = ev.target.scrollTop;
                        $(ev.target).data('originalElement').scrollLeft = ev.target.scrollLeft;
                    });
                    $(box).data('originalElement', element);

                } else if(element.nodeType === 3) {
                    box = document.createTextNode(element.nodeValue);
                }

                return box;
            }; //end of _dom2box()



            var _setHandlerStyle = function(box, element, styles) {
                var elStyle = getComputedStyle(element);

                /* Clone styles from the original element */
                for(var i=0; i < styles.length; i++) {
                    try {
                        box.style[ styles[i] ] = elStyle[ styles[i] ];
                    } catch(e) {}
                }

                /* Apply default styles */
                box.style['border-style'] = 'solid';
                box.style['border-color'] = 'transparent';

            }; //end of _setHandlerStyle()



            var _updateHandlerOf = function(element) {
                _setHandlerStyle(element, $(element).data('originalElement'), styles);

                if(element === handler.body) {
                    handler.body.style.width = content.body.style.width;
                    handler.body.style.height = content.body.style.height;
                } else if(element === handler.html) {
                    handler.html.style.width = content.html.style.width;
                    handler.html.style.height = content.html.style.height;
                }
            }; //end of _updateHandlerOf()



            var _traverse = function(element, handleElement) {

                var nodeList = element.childNodes,
                node,
                box;

                for(var i = 0; i < nodeList.length; i++) {

                    node = nodeList.item(i);

                    if(node.nodeType === 1) {
                        box = _dom2box(node);
                        handleElement.appendChild(box);
                        _traverse(node, box);
                    } else if(node.nodeType === 3) {
                        box = _dom2box(node);
                        handleElement.appendChild(box);
                    }
                }

            }; //end of _traverse()



            var _findHandlerFor = function(element) {
                return $(handler.html).find('.element').andSelf().filter(function() {
                    return $.hasData(this) && $.data(this, 'originalElement') === element;
                });
            }; //end of _findHandlerFor()



            var _create = function(previouslyExists) {
                /* Initialize the shortcut names */
                content.window = $content[0].contentWindow;
                content.document = $content[0].contentDocument;
                content.body = content.document.body;
                content.html = content.document.getElementsByTagName('HTML')[0];
                handler.window = $handle[0].contentWindow;
                handler.document = $handle[0].contentDocument;
                handler.body = handler.document.body;
                handler.html = handler.document.getElementsByTagName('HTML')[0];

                /* Associate top parent elements with their own equivalent on
                   the original document. */
                $(handler.window).data('originalElement', content.window);
                $(handler.html).data('originalElement', content.html);
                $(handler.document).data('originalElement', content.document);
                $(handler.body).data('originalElement', content.body);

                /* Style <HTML> and <BODY> elements as their original equivalent */
                _setHandlerStyle(handler.html, content.html, styles);
                handler.html.style.width = content.html.style.width;
                handler.html.style.height = content.html.style.height;
                _setHandlerStyle(handler.body, content.body, styles);
                handler.body.style.width = content.body.style.width;
                handler.body.style.height = content.body.style.height;

                /* Create the Wireframe */
                _traverse(content.body, handler.body);

                /* Set scroll position to the previous value (0 at the beginning)  */
                handler.body.scrollLeft = handler.scrollLeft;
                handler.body.scrollTop = handler.scrollTop;


                /* If it's the first time we're creating the Wireframe... */
                if(!previouslyExists) {

                    /* Event Handlers */
                    handler.document.addEventListener('copy', Interaction.events.copy);
                    handler.document.addEventListener('click', Interaction.events.click);
                    handler.document.addEventListener('selectstart', Interaction.events.selectStart);
                    handler.document.addEventListener('keydown', Interaction.events.keydown);
                    handler.document.addEventListener('scroll', Interaction.events.scroll);
                }


            }; //end of _create()



            var _update = function(empty) {
                var aux = $(selectedElement).data('originalElement');

                $blocker.css('display', 'none');

                if(empty === true) {

                    while (handler.body.firstChild) {
                        handler.body.removeChild(handler.body.firstChild);
                    }

                    _create(true);
                    if(selectedElement !== null) {

                        aux = _findHandlerFor(aux);

                        if( aux && aux.length > 0 ) {
                            Interaction.element.select(aux[0], true, true);
                        }
                    }

                } else {
                    $(handler.document).find('.element').add(handler.html).each(function() {
                        _setHandlerStyle(this, $(this).data('originalElement'), styles);
                    });
                    handler.html.style.width = content.html.style.width;
                    handler.html.style.height = content.html.style.height;
                    handler.body.style.width = content.body.style.width;
                    handler.body.style.height = content.body.style.height;
                }

            }; //end of _update()




            return {
                create: _create,
                update: _update,
                setHandlerStyle: _setHandlerStyle,
                findHandlerFor: _findHandlerFor,
                updateHandlerOf: _updateHandlerOf
            };

        })();





        var Interaction = (function() {

            var _selectElement = function(element, force, silent) {

                if( force || (element !== null && (element.classList.contains('element') || element.className === 'element' )) ) {
                    $('.element', handler.body).removeClass('element-hover').css('box-shadow', 'none');
                    element.classList.add('element-hover');

                    //Element padding and margin sizes
                    var padTop = element.style.paddingTop,
                    padBottom = element.style.paddingBottom,
                    padLeft = element.style.paddingLeft,
                    padRight = element.style.paddingRight,
                    marginTop = element.style.marginTop,
                    marginBottom = element.style.marginBottom,
                    marginLeft = element.style.marginLeft,
                    marginRight = element.style.marginRight;

                    // Element padding indicators
                    element.style.boxShadow = 'inset lime 0 ' + padTop + ' 0';
                    element.style.boxShadow += ',inset lime 0 -' + padBottom + ' 0';
                    element.style.boxShadow += ',inset lime ' + padLeft + ' 0 0';
                    element.style.boxShadow += ',inset lime -' + padRight + ' 0 0';

                    //Element margin indicators
                    element.style.boxShadow += ', orange -' + marginLeft + ' -' + marginTop + ' 0';
                    element.style.boxShadow += ', orange ' + marginRight + ' ' + marginBottom + ' 0';
                    element.style.boxShadow += ', orange ' + marginRight + ' -' + marginTop + ' 0';
                    element.style.boxShadow += ', orange -' + marginLeft + ' ' + marginBottom + ' 0';

                    selectedElement = element;
                    console.dir(element);
                } else if( element === handler.body || element === handler.html ) {
                    selectedElement = element;
                }

                if(!silent) {
                    didgeridoo.api.event.publish(moduleName + '.element.select', $(selectedElement).data('originalElement'));
                }

            }; //end of _selectElement()



            var _addElement = function(html, target) {
                

                assert(	typeof target === 'undefined' ||
                    target instanceof content.window.HTMLElement,
                    'Error in module Designer.\n' +
                    'Designer._addElement(html[, target]): the specifid "target" is not an HTML Element.' );

                if( typeof target === 'undefined' ) {
                    var originalElement = $(selectedElement).data('originalElement');

                    target = typeof originalElement !== 'undefined' ? originalElement : content.body;
                }

                target.innerHTML += html;
                Wireframe.update(true);
            }; //end of _addElement()



            var _removeElement = function(element) {
                if(!editing && element && element !== handler.body) {
                    $($(element).data('originalElement')).remove();
                    while (handler.body.firstChild) {
                        handler.body.removeChild(handler.body.firstChild);
                    }

                    selectedElement = null;
                    Wireframe.create(true);
                    _selectElement(null);
                }
            }; //end of _removeElement()



            var _editText = function(element, ev) {
                if(element.contentEditable !== 'true') {
                    element.normalize();
                    element.contentEditable = true;
                    element.style.color = '#000';
                    element.focus();

                    var sel = _getSelection(),
                    lastChild = sel.anchorNode.parentNode.lastChild;

                    if(element.innerText.trim().length > 0) {
                        if(lastChild.nodeType === Node.TEXT_NODE) {
                            sel.collapse(lastChild, lastChild.length);
                        } else {
                            sel.collapse(lastChild, lastChild.outerHTML.length);
                        }
                    } else {
                        sel.collapse(element, 0);
                    }

                    editing = true;

                    element.addEventListener('blur', function() {
                        _stopEditingText(element);
                    });

                    element.addEventListener('keyup', function(ev) {
                        var $element = $(element);

                        $element.data('originalElement').innerHTML = element.innerHTML;

                        Wireframe.setHandlerStyle(element, $element.data('originalElement'), styles);
                        $element.parentsUntil('body').each(function(index) {
                            Wireframe.setHandlerStyle(this, $(this).data('originalElement'), styles);
                        });
                    });

                    element.addEventListener('paste', function(ev) {
                        $($(element).data('originalElement')).html($(element).html());

                        Wireframe.setHandlerStyle(element, $(element).data('originalElement'), styles);
                        $(element).parentsUntil('body').each(function(index) {
                            Wireframe.setHandlerStyle(this, $(this).data('originalElement'), styles);
                        });
                    });

                    ev.preventDefault();
                } else {
                    switch(ev.which) {
                        case 13:
                            var sel = _getSelection(),
                            anchorPos = sel.anchorOffset,
                            range = _getRange(),
                            text,
                            start,
                            end,
                            child,
                            lon = 0;


                            for(var i = 0; i < element.childNodes.length; i++) {
                                child = element.childNodes[i];
                                if(child.nodeType === Node.TEXT_NODE && child !== sel.anchorNode) {
                                    anchorPos += child.length;
                                } else if(child === sel.anchorNode) {
                                    break;
                                } else {
                                    anchorPos += child.outerHTML.length;
                                }
                            }

                            breakPos = anchorPos + _getCaretPadding(element, anchorPos);

                            text = element.innerHTML;
                            start = text.substring(0, breakPos);
                            end = text.substring(breakPos, text.length);


                            element.innerHTML = start + '<br>' + end;

                            var newAnchorPos = 0;
                            for(var i = 0; i < element.childNodes.length && lon < anchorPos; i++) {
                                child = element.childNodes[i];

                                if(child.nodeType === Node.TEXT_NODE) {
                                    lon += child.length;
                                    newAnchorPos++;
                                } else {
                                    lon += child.outerHTML.length;
                                    newAnchorPos++;
                                }
                            }

                            //It means Caret is at the end, so we have to manually append a BR
                            if(text.trimRight().length == lon) {
                                element.appendChild(handler.document.createElement('BR'));
                            }

                            sel.collapse(element, newAnchorPos+1);


                            ev.preventDefault();
                            break;

                        case 32:
                            //$(element).html($(element).html() + ' ');
                            break;
                    }
                }
            }; //end of _editText()



            var _stopEditingText = function(element) {
                element.contentEditable = false;
                element.style.color = 'transparent';
                element.normalize();
                editing = false;
            }; //end of _stopEditingText()



            var _getCaretPadding = function(element, caretPos) {
                var text = element.innerHTML,
                exp = /&[#\w]+;/mig,
                match,
                padding = 0;

                while(match = exp.exec(text)) {
                    if(caretPos > match.index && caretPos < (match.index + match[0].length)) {
                        padding += match[0].length-1;
                    } else if(match.index < caretPos) {
                        padding += match[0].length-1;
                    }
                }

                return padding;
            }; //end of getCaretPadding()



            var _getCaretPosition = function(element) {
                var range = _getRange(),
                caretPos = 0;

                if(range) {
                    //range.commonAncestorContainer.textContent = $.trim(range.commonAncestorContainer.textContent);
                    //console.log(range);
                    if (range.commonAncestorContainer.parentNode == element) {
                        caretPos = range.endOffset;
                    }
                }

                return caretPos;
            }; //end of _getCaretPosition()



            var _getSelection = function() {
                return handler.window.getSelection() || null;
            }; //end of _getSelection()



            var _getRange = function() {
                var sel = _getSelection();

                if(sel) {
                    if (sel.rangeCount) {
                        //console.log(sel);
                        range = sel.getRangeAt(0);
                    }

                    return range;
                }

                return null;
            }; //end of _getRange()



            var _copyEventHandler = function(ev) {
            };



            var _clickEventHandler = function(ev) {
                _selectElement(ev.target);
                handler.window.focus();
            };



            var _scrollEventHandler = function(ev, force) {
                if(force || ev.target === handler.document) {
                    content.body.scrollTop = handler.body.scrollTop;
                    content.body.scrollLeft = handler.body.scrollLeft;
                    //Fifrefox workaround
                    $('html', content.document).scrollTop(handler.body.scrollTop)
                                               .scrollLeft(handler.body.scrollLeft);


                    handler.scrollLeft = handler.body.scrollLeft;
                    handler.scrollTop = handler.body.scrollTop;
                }
            };



            var _selectstartEventHandler = function(ev) {
                if(!editing && ev.target !== handler.html) {
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            };



            var _keydownEventHandler = function(ev) {
                if(selectedElement !== handler.html && selectedElement !== handler.body) {
                    switch(ev.which) {
                        case 46:	//DELETE
                        case 8:		//BACKSPACE
                            if(!editing) {
                                _removeElement(selectedElement);
                                ev.preventDefault();
                            }
                            break;

                        case 32:	//SPACE
                            if(!editing) {
                                ev.preventDefault();
                            }
                            break;

                        case 13:	//ENTER
                            _editText(selectedElement, ev);
                            break;

                        case 27:	//ESC
                            //WARNING: This is a temporary solution while developing
                            //Correct functionality is to go back to the previous state of the object
                            _stopEditingText(selectedElement);
                            break;
                    }
                }
            };




            return {
                element: {
                    select: _selectElement,
                    add: _addElement,
                    remove: _removeElement,
                    text: {
                        startEditing: _editText,
                        stopEditing: _stopEditingText
                    },
                    selected: selectedElement
                },
                events: {
                    copy: _copyEventHandler,
                    click: _clickEventHandler,
                    keydown: _keydownEventHandler,
                    selectStart: _selectstartEventHandler,
                    scroll: _scrollEventHandler
                }
            };

        })();







        var URL;

        didgeridoo.api.event.subscribe('didgeridoo-document.document.change', function(topics, id) {
            if(	handler.loaded && content.loaded ) {
                Wireframe.update(true);
            }
        });

        didgeridoo.api.event.subscribe('didgeridoo-layout.tab.show', function(topics, id) {
            if(	handler.loaded && content.loaded &&
                $container &&
                $container.parents('#' + id).length === 1 ) {

                Wireframe.update(false);
            }
        });

        didgeridoo.api.event.subscribe('didgeridoo-document.document.load, didgeridoo-layout.tab.show', function(topics, id) {
            if( didgeridoo.documents[id].getState() === 'loaded' &&
                $container &&
                $container.parents('#' + id).length === 1 ) {

                Interaction.element.select(Interaction.element.selected);
            }
        });

        didgeridoo.api.event.subscribe('didgeridoo-tools.tool.select', function(topics, html) {
            Interaction.element.add(html);
        });

        didgeridoo.api.event.subscribe(moduleName + '.content.loaded', function(topics, evt) {
            _contentLoaded();
        });

        didgeridoo.api.event.subscribe('layout.resize', function(topics, ui) {
            Wireframe.update(false);
        });

        didgeridoo.api.event.subscribe(moduleName + '.handle.loaded', function(topics, evt) {
            _handlerLoaded();
        });

        didgeridoo.api.event.subscribe('layout.resizing', function(topics, ui) {
            $blocker.css('display', 'block');
        });

        didgeridoo.api.event.subscribe(moduleName + '.content.resized', function(topics, evt) {
            didgeridoo.api.event.publish('layout.resized', evt);
        });

        didgeridoo.api.event.subscribe(moduleName + '.handle.resized', function(topics, evt) {
            didgeridoo.api.event.publish('layout.resized', evt);
        });

        didgeridoo.api.event.subscribe('window.resize', function(topics, evt) {
            didgeridoo.api.event.publish('layout.resize', evt);
        });


        //Private methods for the public interface
        var _handlerLoaded = function() {
            handler.loaded = true;

            if(content.loaded) {
                $content.animate({
                    opacity: 1
                }, 800);
                $handle.animate({
                    opacity: 1
                }, 800, function() {
                    Wireframe.create(false);
                    if(typeof _loadedCallback === 'function') _loadedCallback.call(this);
                });
            }

        };

        var _contentLoaded = function() {
            content.loaded = true;

            if(handler.loaded) {
                $content.animate({
                    opacity: 1
                }, 800);
                $handle.animate({
                    opacity: 1
                }, 800, function() {
                    Wireframe.create(false);
                    if(typeof _loadedCallback === 'function') _loadedCallback.call(this);
                });
            }
        };

        var _loadedCallback;
        var _loadURL = function(url, callback) {
            URL = url;
            content.loaded = false;
            handler.loaded = false;
            _loadedCallback = callback;

            $content.css('opacity', 0);
            $handle.css('opacity', 0);

            $content.attr('src', url);
            $handle.attr('src', handlerURL);
        };

        var _getURL = function() {
            return URL;
        };

        var _getHandlerURL = function() {
            return handlerURL;
        };

        var _renderTo = function(selector, callback) {
            
            assert(	typeof selector === 'string' ||
                typeof selector === 'object',
                'Error in module Designer.\n' +
                'Designer.renderTo(selector[, callback]): "selector" must be a String or an Object.');

            assert(	typeof callback === 'function' ||
                typeof callback === 'undefined',
                'Error in module Designer.\n' +
                'Designer.renderTo(selector[, callback]): "callback" is not a Function.');

            var instance = this;

            $container = $(selector);
            $container.html(html);
            $blocker = $('.didgeridoo-designer-blocker', selector);
            $content = $('.didgeridoo-designer-content', selector);
            $handle = $('.didgeridoo-designer-handle', selector);

            $content.resize(function(ev) {
                didgeridoo.api.event.publish(moduleName + '.content.resized', ev);
            });

            $handle.resize(function(ev) {
                didgeridoo.api.event.publish(moduleName + '.handle.resized', ev);
            });

            $handle[0].addEventListener('load', function(evt) {
                _handlerLoaded(evt);
            });

            $content[0].addEventListener('load', function(evt) {
                _contentLoaded(evt);
            });

            didgeridoo.api.event.publish(moduleName + '.rendered', instance);

            if(callback) {
                callback();
            }

            return this;
        };


        //Public interface
        return {
            loadURL: _loadURL,
            getURL: _getURL,
            getHandlerURL: _getHandlerURL,
            renderTo: _renderTo
        };


    }; //end of Designer()



    return Designer;


}); //end of define
