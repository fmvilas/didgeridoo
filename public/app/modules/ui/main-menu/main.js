"use strict";
define(['require', 'text!./main.html', 'modules/ui/layout/layout'], function(require, html) {

    var moduleName = 'MainMenu',
    cssFile = require.toUrl('./main.css');
    
    var MainMenu = function() {
        
        //Render the content
        var _renderTo = function(selector, callback) {
            
            var assert = didgeridoo.utils.assert;
            assert(typeof selector === 'string' ||
                typeof selector === 'object',
                'Error in module ' + moduleName + '.\n' +
                'MainMenu.renderTo([selector[, callback]]): if specified, "selector" must be a String or an Object.');
            
            assert(typeof callback === 'function' ||
                typeof callback === 'undefined',
                'Error in module ' + moduleName + '.\n' +
                'MainMenu.renderTo(selector[, callback]): "callback" is not a Function.');
            
            
            //Add HTML
            $(selector).append(html);
            
            // !!! Styles are loaded in the minified version
            // Load styles
            //didgeridoo.utils.loadCSS(cssFile);
            
            var $mainMenu = $('#didgeridoo-main-menu', selector);
            
            //Load User Info
            $('#didgeridoo-main-menu-user').tmpl({
                name: "Flan",
                avatar: "http://gravatar.com/avatar/f3bad9b06a1b0512c5c837f28dddd985?s=37&d=mm"
            }).appendTo($mainMenu);
            
            
            //Mouseover and Mouseout (with jquery $obj.hover)
            $("li:not(.didgeridoo-main-menu-disabled)", $mainMenu).hover(function(){
		
                var $sub = $('ul:first', this),
                $parent = $(this).parent(),
                $me = $(this),
                $all = $('ul', $mainMenu);
		
                if($parent.attr('id') != 'didgeridoo-main-menu') {
                    if($sub.length > 0) {
                        $sub.css('left', $parent.width())
                        .css('top', $me.position().top);
                    }
		        
                    $sub.stop().css('display', 'block');
                } else if($mainMenu.data('open') === true) {
                    $all.css('display', 'none');
                    $sub.stop().css({
                        'top': $me.position().top + 4,
                        'border-top': 'none',
                        'display': 'block'
                    });
                } else {
                    $sub.css({
                        'top': $me.position().top + 4,
                        'border-top': 'none'
                    });
                }
		    
                $all.stop();
                $me.addClass("hover");
		
            }, function(){
			
                var $sub = $('ul:first', this),
                $parent = $(this).parent(),
                $me = $(this);
				
                if($parent.attr('id') != 'didgeridoo-main-menu') {
                    $sub.css('display','none');
                } else {
                    $sub.animate({
                        display:'block'
                    }, 1000, function() {
                        $(this).css('display', 'none');
                        $mainMenu.data('open', false);
                    });
                }
		    
                $me.removeClass("hover");
		
            });
	
            $('li:not(.didgeridoo-main-menu-disabled)', $mainMenu)
            .not('.didgeridoo-main-menu-separator').click(function() {
                var $this = $(this),
                $sub = $('ul:first', this),
                $parent = $this.parent();
						
                if($parent.attr('id') === 'didgeridoo-main-menu') {
                    $mainMenu.data('open', !$mainMenu.data('open'));
                    $sub.css('display', ($sub.css('display') === 'block') ? 'none' : 'block');
                } else {
                    $parent.css('display', 'none');
                    $mainMenu.data('open', false);
                    
                    didgeridoo.observer.publish(moduleName + '.item.select', {
                        action: $this.data('action'),
                        args: $this.data('args')
                    });
                }
                
                return false;
	
            });
		
            $('ul li', $mainMenu).each(function() {
                var $me = $(this);
                if($me.data('hotkey')) {
                    $me.append("<span class='didgeridoo-main-menu-hotkey'>" + $me.data('hotkey') + "</span>");
                }
            });
		
		    
            $('ul li:has(ul)', $mainMenu).append("<span class='didgeridoo-main-menu-open-icon'></span>");
            
            if(typeof callback !== 'undefined') callback.call();
            
            didgeridoo.observer.publish(moduleName + '.load');
            didgeridoo.observer.publish(moduleName + '.render');
        }; //end of _renderTo
        
        
        
        //Manage clicked menu items
        didgeridoo.observer.subscribe(moduleName + '.item.select', function(topic, data) {
            
            didgeridoo.Action.do(data.action, data.args);

        });
        
        
        
        
        
        return {
            renderTo: _renderTo
        };
    };
    
    
    
    
    
    return MainMenu;
}); //end of define