"use strict";
define([
'require',
'text!./main.html',
'API.Event',
'autogrow'
], function(require, html) {

	var moduleName = 'DOMInspector';


	var DOMInspector = function() {
		if ( !(this instanceof DOMInspector) )
      		return new DOMInspector();

		var ownerDocument,
			element,
			_CSSProperties = [
	    				'background-attachment',
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
						'border-bottom-style',
						'border-bottom-width',
						'border-collapse',
						'border-image-outset',
						'border-image-repeat',
						'border-image-slice',
						'border-image-source',
						'border-image-width',
						'border-left-color',
						'border-left-style',
						'border-left-width',
						'border-right-color',
						'border-right-style',
						'border-right-width',
						'border-top-color',
						'border-top-left-radius',
						'border-top-right-radius',
						'border-top-style',
						'border-top-width',
						'bottom',
						'box-shadow',
						'box-sizing',
						'caption-side',
						'clear',
						'clip',
						'color',
						'cursor',
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
						'opacity',
						'orphans',
						'outline-color',
						'outline-style',
						'outline-width',
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
						'resize',
						'right',
						'speak',
						'table-layout',
						'text-align',
						'text-decoration',
						'text-indent',
						'text-rendering',
						'text-shadow',
						'text-overflow',
						'text-transform',
						'top',
						'unicode-bidi',
						'vertical-align',
						'visibility',
						'white-space',
						'widows',
						'width',
						'word-break',
						'word-spacing',
						'word-wrap',
						'z-index',
						'zoom',
						'-webkit-animation-delay',
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
						'-webkit-background-size',
						'-webkit-border-fit',
						'-webkit-border-horizontal-spacing',
						'-webkit-border-image',
						'-webkit-border-vertical-spacing',
						'-webkit-box-align',
						'-webkit-box-direction',
						'-webkit-box-flex',
						'-webkit-box-flex-group',
						'-webkit-box-lines',
						'-webkit-box-ordinal-group',
						'-webkit-box-orient',
						'-webkit-box-pack',
						'-webkit-box-reflect',
						'-webkit-box-shadow',
						'-webkit-color-correction',
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
						'-webkit-text-fill-color',
						'-webkit-text-orientation',
						'-webkit-text-security',
						'-webkit-text-stroke-color',
						'-webkit-text-stroke-width',
						'-webkit-transform',
						'-webkit-transform-origin',
						'-webkit-transform-style',
						'-webkit-transition-delay',
						'-webkit-transition-duration',
						'-webkit-transition-property',
						'-webkit-transition-timing-function',
						'-webkit-user-drag',
						'-webkit-user-modify',
						'-webkit-user-select',
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
						'clip-path',
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
						'vector-effect'
	    ];



	    var _getCSSRules = function(el) {
		    var appliedRules = {},
		    	$element = $(el);

		    // TODO: it will fail when a object is removed from Designer view because el will be undefined
		    ownerDocument = el.ownerDocument;

		    for ( var x = 0; x < ownerDocument.styleSheets.length; x++ ) {
		        var rules = ownerDocument.styleSheets[x].cssRules;

		        if( rules ) {
		        	for ( var i = 0; i < rules.length; i++ ) {
			            if ( $element.is(rules[i].selectorText) ) {
			                var y = appliedRules[ ownerDocument.styleSheets[x].href ] || {};
			                y[rules[i].selectorText] = {
			                	style: rules[i].style,
			                	original: ownerDocument.styleSheets[x].cssRules[i]
			                };
			                appliedRules[ ownerDocument.styleSheets[x].href ] = y;
			            }
			        }
		        }
		    }
		    return appliedRules;
		};



	    var _findRule = function(file, rule) {
	    	for(var i=0; i < ownerDocument.styleSheets.length; i++) {
	    		if(ownerDocument.styleSheets[i].href === file) {
	    			for(var h=0; h < ownerDocument.styleSheets[i].cssRules.length; h++) {
	    				if(ownerDocument.styleSheets[i].cssRules[h].selectorText === rule) {
	    					return ownerDocument.styleSheets[i].cssRules[h];
	    				}
	    			}
	    		}
	    	}

	    	return false;
	    };



	    var _ruleToText = function(ruleContainer, isInlineStyle) {
	    	if(isInlineStyle) {
	    		var cssText = '';

	    		$('.propName, .propValue', ruleContainer).each(function() {
	    			if(this.classList.contains('propName')) {
	    				cssText += this.value + ':';
	    			} else {
	    				cssText += this.value + ';';
	    			}
	    		});

	    		return cssText;
	    	} else {
	    		var cssText = $(ruleContainer).data('rulename') + ' {\n';

	    		$('.propName, .propValue', ruleContainer).each(function() {
	    			if(this.classList.contains('propName')) {
	    				cssText += '\t' + this.value + ':';
	    			} else {
	    				cssText += this.value + ';\n';
	    			}
	    		});

	    		cssText += '}';

	    		return cssText;
	    	}
	    };



	    var _parseCSSText = function(cssText) {
	    	var lines = cssText ? cssText.match(/(.*?):((".*?")|('.*?')|(.*?));/ig) : '',
	    		result = [];

	    	for(var i=0; i < lines.length; i++) {
	    		var firstSplit = lines[i].indexOf(':');

	    		if( firstSplit !== -1 ) {
	    			var lastSplit = lines[i].lastIndexOf(';');

	    			if( lastSplit === -1 ) lastSplit = lines[i].length-1;

	    			var propName = lines[i].substring(0, firstSplit).trim(),
	    				propValue = lines[i].substring(firstSplit+1, lastSplit).trim();

	    			result[propName] = propValue;
	    			result.push(propName);
	    		} else {
	    			return false;
	    		}
	    	}

	    	return result;
	    };



		var _renderTo = function(selector, callback) {
				assert(	typeof selector === 'string' ||
						typeof selector === 'object',
						'Error in module ' + moduleName + '.\n' +
						'DOMInspector._renderTo(selector[, callback]): "selector" must be a String or an Object.');

				assert(	typeof callback === 'function' ||
						typeof callback === 'undefined',
						'Error in module ' + moduleName + '.\n' +
						'DOMInspector._renderTo(selector[, callback]): "callback" is not a Function.');



			$(selector).append(html);

		    $('#dom-inspector').on('change', '.applied', function(ev) {
	    		if( $(this).parents('.css-rule').hasClass('inlineStyle') ) {
	    			var prop = $(this).parent('.css-line')[0];

		    		if(!this.checked) {
		    			element.style[prop.dataset.propname] = null;
		    		} else {
		    			element.style[prop.dataset.propname] = prop.dataset.propvalue;
		    		}
		    	} else {
		    		var rule = _findRule(this.dataset.cssfile, this.dataset.rulename);

			    	if( rule ) {
			    		if(!this.checked) {
			    			rule.style[this.dataset.propname] = null;
			    		} else {
			    			rule.style[this.dataset.propname] = this.dataset.propvalue;
			    		}
			    	}
		    	}

		    	didgeridoo.api.event.publish('didgeridoo-document.document.change', null);
		    });

		    $('#dom-inspector').on('keydown', '.propName', function(ev) {
		    	switch(ev.keyCode) {
		    		case 13:
		    		case 186:
		    			var $valueInput,
		    				$rule = $(this).parents('.css-rule'),
			    			$line = $(this).parent('.css-line');

		    			$valueInput = $('.propValue', $line);

		    			/* element.style */
		    			if( $rule.hasClass('inlineStyle') ) {
			    			if(this.value.length === 0) {
			    				$line.remove();
			    			}

			    			var cssText = _ruleToText( $rule, true );
			    			element.style.cssText = cssText;
				    	}
				    	/* some css rule */
				    	else {
				    		console.log( _ruleToText($rule, false) );
				    	}

		    			$valueInput.focus();

		    			didgeridoo.api.event.publish('didgeridoo-document.document.change', null);

		    			ev.preventDefault();
		    		break;

		    		case 27: //Esc
			    		$(this).parent('.css-line').remove();
			    	break;
		    	}
		    });

		    $('#dom-inspector').on('keydown', '.propValue', function(ev) {
		    	switch(ev.keyCode) {
		    		case 13: //Enter
		    			var $nameInput,
		    				$rule = $(this).parents('.css-rule'),
			    			$line = $(this).parent('.css-line');

		    			$nameInput = $('.propName', $line.next('.css-line'));

		    			/* element.style */
		    			if( $rule.hasClass('inlineStyle') ) {
			    			if(this.value.length === 0) {
			    				$line.remove();
			    			}

			    			var cssText = _ruleToText( $rule, true );
			    			element.style.cssText = cssText;
				    	}
				    	/* some css rule */
				    	else {
				    		console.log( _ruleToText($rule, false) );
				    	}

		    			$nameInput.focus();
		    			didgeridoo.api.event.publish('didgeridoo-document.document.change', null);

		    			ev.preventDefault();
		    		break;

		    		case 27: //Esc
			    		$(this).parent('.css-line').remove();
			    	break;
		    	}
		    });

		    $('#dom-inspector').on('blur', '.propName, .propValue', function(ev) {
		    	this.value = this.value.trim();

		    	//If nothing is specified then delete the line
		    	if( this.value === '') {
			    	$(this).parent('.css-line').remove();
		    	}
		    });

		    $('#dom-inspector').on('click', '.ruleName', function(ev) {
		    	var $rule = $(this).parent('.css-rule');

		    	$(this).after('<span class="css-line" data-propname="" data-propvalue=""><input class="applied" type="checkbox" checked="checked">' +
							'<input type="text" class="propName" data-prevProp="" value="">: ' +
							'<input type="text" class="propValue" data-prevValue="" value="">;</span>');

				var $nameInput = $('.propName::first', $rule),
					$valueInput = $('.propValue::first', $rule);

				$nameInput.autoGrowInput({
					comfortZone: 0
				});

				$valueInput.autoGrowInput({
					comfortZone: 0
				});

				$nameInput.focus();
		    });

    		didgeridoo.api.event.subscribe('didgeridoo-designer.element.select', function(topic, el) {
    			if(typeof el !== 'undefined') {
    				_update( el );
    			} else {
    				$('#dom-inspector').empty();
    			}
    		});

		    didgeridoo.api.event.publish(moduleName + '.rendered');

		    if(callback) {
				callback();
			}

		};



		var _update = function(el) {
			element = el;

			var CSSRules = _getCSSRules(element),
				cssFiles = Object.getOwnPropertyNames(CSSRules),
				container = $('#dom-inspector')[0],
				html = '';

			container.innerHTML = '';

			html += '<div class="css-rule inlineStyle light-scrollbar"><span class="ruleName">element.style {</span>';

			var lines = _parseCSSText(element.style.cssText);
			for(var i=0; i < lines.length; i++) {
				html += '<span class="css-line" data-propname="' + lines[i] + '" data-propvalue="' +
						lines[lines[i]] + '"><input class="applied" type="checkbox" checked="checked">' +
						'<input type="text" class="propName" data-prevProp="' + lines[i] + '" value="' + lines[i] + '">: ' +
						'<input type="text" class="propValue" data-prevValue="' + lines[i] + '" value="' + lines[lines[i]] + '">;</span>';
			}

			html += '}</div>'

			for(var i=0; i < cssFiles.length; i++) {
				var filename = cssFiles[i];

				if(filename === 'null') {
					filename = 'Style Tag';
					html += '<h3><a>' + filename + '</a></h3>';
				} else {
					filename = filename.substr(filename.lastIndexOf('/') + 1);
					html += '<h3><a href="' + cssFiles[i] + '" target="_blank">' + filename + '</a></h3>';
				}
				

				var rules = Object.getOwnPropertyNames( CSSRules[cssFiles[i]] );
				
				for(var j=0; j < rules.length; j++) {
					var lines = _parseCSSText( CSSRules[cssFiles[i]][ rules[j] ].style.cssText );
					html += '<div class="css-rule light-scrollbar" data-rulename="' + rules[j] + '" data-cssfile="' + cssFiles[i] + '"><span class="ruleName">' + rules[j] + ' {</span>';

					for(var h=0; h < lines.length; h++) {
						html += '<span class="css-line" data-propname="' + lines[h] + '" data-propvalue="' +
								lines[lines[h]] + '"><input class="applied" type="checkbox" checked="checked">' +
								'<input type="text" class="propName" data-prevProp="' + lines[h] + '" value="' + lines[h] + '">: ' +
								'<input type="text" class="propValue" data-prevValue="' + lines[h] + '" value="' + lines[lines[h]] + '">;</span>';
					}

					html += '}</div>'
				}
			}

			container.innerHTML = html;

			$('.propName, .propValue').autoGrowInput({
				comfortZone: 4
			});
		};


		didgeridoo.api.event.subscribe('Designer.element.select', function(topic, el) {
			_update(el);
		});




		return {
			id: 'didgeridoo-dom-inspector',
            title: 'DOM Inspector',
            iconClass: 'icon32 icon32-inspector',
			renderTo: _renderTo,
			getCSSRules: _getCSSRules
		};
	};


	return new DOMInspector();


}); //end of define
