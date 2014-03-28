"use strict";
define([
    'require',
    'text!./main.html',
    'API.Action',
    'API.Event',
    'layout',
    'API.User',
    'modules/user/user'
], function(require, html) {

    var moduleName = 'MainMenu';
    
    var MainMenu = function() {
        
        //Render the content
        var _renderTo = function(selector, callback) {
            
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
            
            var $mainMenu = $('#didgeridoo-main-menu', selector);
            
            //Load User Info
            didgeridoo.api.user.get(function(u) {
                if( u.name.length > 0 ) $('.didgeridoo-main-menu-user-name').html(u.name);
                if( u.avatarURL.length > 0 ) $('.didgeridoo-main-menu-user-avatar').attr('src', u.avatarURL);
            });
            


            var mainMenu = document.querySelector('#didgeridoo-main-menu'),
                didgeridooLogo = document.querySelector('#didgeridoo-main-menu-didgeridoo'),
                timeoutId;

            didgeridooLogo.addEventListener('click', function() {
                didgeridoo.layout.northPanel.classList.toggle('collapsed');
            });

            mainMenu.addEventListener('mouseleave', function() {
                timeoutId = setTimeout(function() {
                    didgeridoo.layout.northPanel.classList.add('collapsed');
                }, 1000);
            });

            mainMenu.addEventListener('mouseenter', function() {
                if( timeoutId ) clearTimeout(timeoutId);
            });


            
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
                    
                    didgeridoo.api.event.publish(moduleName + '.item.select', {
                        action: $this.data('action'),
                        args: $this.data('args')
                    });
                }	
            });
		
            $('ul li', $mainMenu).each(function() {
                var $me = $(this);
                if($me.data('hotkey')) {
                    $me.append("<span class='didgeridoo-main-menu-hotkey'>" + $me.data('hotkey') + "</span>");
                }
            });
		
		    
            $('ul li:has(ul)', $mainMenu).append("<span class='didgeridoo-main-menu-open-icon'></span>");
            
            if(typeof callback !== 'undefined') callback.call();
            
            didgeridoo.api.event.publish(moduleName + '.load');
            didgeridoo.api.event.publish(moduleName + '.render');
        }; //end of _renderTo
        
        
        
        //Manage clicked menu items
        didgeridoo.api.event.subscribe(moduleName + '.item.select', function(topic, data) {
            
            didgeridoo.api.action.do(data.action, data.args);

        });
        
        
        
        
        
        return {
            renderTo: _renderTo
        };
    };
    
    
    
    
    
    return MainMenu;
}); //end of define