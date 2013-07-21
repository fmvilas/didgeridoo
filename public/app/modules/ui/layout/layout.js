"use strict";
define([
    'require',
    'text!./layout.html',
    'core',
    'libraries/jqueryui/tabs',
    'libraries/jqueryui/sortable',
    'libraries/jqueryui/resizable'
    ], function(require, html) {
    
    //Add HTML
    document.body.innerHTML += html;
    
    // !!! Styles are loaded in the minified version
    // Load styles
    //var cssFile = require.toUrl('./layout.css');
    //didgeridoo.utils.loadCSS(cssFile);
    
    
    
    
    
    var moduleName = 'Layout',
    $northPanel = $('.ui-layout-north'),
    $sidebar = $('.ui-layout-sidebar'),
    $sidebarNav = $('.ui-layout-sidebar-nav', $sidebar),
    $sidebarContainer = $('.container', $sidebar),
    $centerPanel = $('.ui-layout-center'),
    $centerPanelTabs = $('.ui-layout-center-tab-list'),
    sidebarIsResizing = false;
    
    
    //Create Tabs on the center panel
    $centerPanel.tabs({
        tabTemplate: '<li><a href="#{href}">#{label}</a> <span rel="#{href}" class="ui-icon ui-icon-close">Remove Tab</span></li>',
        show: function(ev, ui) {
            didgeridoo.documents.currentDocument = didgeridoo.documents[ui.panel.id];
            didgeridoo.observer.publish(moduleName + '.tab.show', ui.panel.id);
        }
    });
    
    //Make Tabs sortable
    $centerPanelTabs.sortable({
        axis: 'x',
        forceHelperSize: true
    });

    //Create a new empty file on double click the tabs bar
    $centerPanelTabs.dblclick(function(ev) {
        if( ev.target === this ) {
            didgeridoo.Action.do('FileNew');
        }
    });
    
    
    //
    //Event handlers for layout
    //
    
    
    //Add functionality to Close button on each tab
    $centerPanelTabs.on('click', '.ui-icon-close', function(ev) {
        var id = $(this).attr('rel').substr(1);
			
        didgeridoo.documents[id].close();
    });
    
    // A little trick to debounce the Window's resize event
    var waitForFinalWindowResizeEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout (timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();
		
    $(window).resize(function (evt) {
        waitForFinalWindowResizeEvent(function(){
            didgeridoo.observer.publish('window.resize', evt);
        }, 500, "some unique string", evt);
    });
    // end of the debounce trick
        
    
    //
    //Events for layout
    //
    
    didgeridoo.observer.subscribe('layout-sidebar.resized', function(topics, ui) {
        layoutSidebarResize(ui);
    });
		
    didgeridoo.observer.subscribe('layout-sidebar.resizing', function(topics, ui) {
        layoutSidebarResize(ui);
    });
        
    didgeridoo.observer.subscribe('window.resize', function(topics, evt) {
        didgeridoo.observer.publish('layout.resized', evt);
    });
		
    didgeridoo.observer.publish(moduleName + '.load');
    didgeridoo.observer.publish(moduleName + '.render');
    
    
    
    
    //
    //Sidebar
    //
    var _sidebar = function() {
            
        var _delay,
        $btnCollapse = $('.ui-layout-sidebar-nav-icon-collapse', $sidebarNav),
        sidebarIsExpanded = false;
        
        $sidebar.bind('mouseleave', function(ev) {
            if(!sidebarIsResizing && !sidebarIsExpanded) {
                _delay = setTimeout(function() {
                    _closeSidebar();
                    $('.ui-layout-sidebar-nav-icon').removeClass('active');
                }, 300);
            }
        })
        .bind('mouseenter', function(ev) {
            if(!sidebarIsExpanded) {
                clearTimeout(_delay);
            }
        });
        
        
        $btnCollapse.click(function() {
            if(sidebarIsExpanded) {
                _closeSidebar();
                        
                $('.ui-layout-sidebar-nav-icon-collapse').removeClass('ui-layout-sidebar-nav-icon-collapse-expanded');
                $('.ui-layout-sidebar-nav-icon').removeClass('active');
            } else {
                var $openedPanels = $('.didgeridoo-panel-window:not(.didgeridoo-panel-window-hidden)', $sidebarContainer);
                
                if($openedPanels.length === 0) return;
                
                _openSidebar();
                        
                $('.ui-layout-sidebar-nav-icon-collapse').addClass('ui-layout-sidebar-nav-icon-collapse-expanded');
                
                var selectedPanel;
                $openedPanels.each(function(index, el) {
                    if( $(el).css('display') === 'block' ) {
                        selectedPanel = $(el).attr('id');
                    }
                });
                
                if(!selectedPanel) {
                    var $firstPanel;
                    
                    $firstPanel = $( $openedPanels.get(0) ).css('display', 'block');
                    selectedPanel = $firstPanel.attr('id');
                }
                
                _selectPanel(selectedPanel);
                $sidebar.removeClass('ui-layout-sidebar-collapsed')
                .removeClass('ui-layout-sidebar-opened')
                .addClass('ui-layout-sidebar-expanded');
            }
            
            didgeridoo.observer.publish('layout-sidebar.resized', null);
            didgeridoo.observer.publish('layout.resize', null);
            
            sidebarIsExpanded = !sidebarIsExpanded;
        });
        
        var _addPanel = function(moduleName) {
            require([moduleName], function(m) {

                $('#didgeridoo-panel-window-template').tmpl({
                    id: m.id,
                    title: m.title,
                    classes: m.classes
                }).appendTo($sidebarContainer);
                
                var $panelWindow = $('#' + m.id);
                
                $( '.didgeridoo-panel-window-close', $panelWindow )
                .click(function() {
                    _removePanel(m);
                });
                
                var icon = document.createElement('I');
                icon.classList.add('ui-layout-sidebar-nav-icon');
                var classList = m.iconClass.split(' ');
                for(var i=0; i < classList.length; i++) {
                    icon.classList.add(classList[i]);
                }
                icon.setAttribute('name', m.id);
                icon.setAttribute('title', m.title);
                icon.addEventListener('click', function(ev) {
                    _selectPanel(icon.getAttribute('name'));
                });
                $sidebarNav.append(icon);
                
                
                m.renderTo($('.didgeridoo-panel-window-content', '#' + m.id).get(0));
                
            });    
        };
        
        var _removePanel = function(module) {
            _closeSidebar();
            $('#' + module.id, $sidebarContainer).addClass('didgeridoo-panel-window-hidden').css('display', 'none');
            $('.ui-layout-sidebar-nav-icon[name=' + module.id + ']', $sidebarNav).addClass('ui-layout-sidebar-nav-icon-hidden');
        };
        
        var _selectPanel = function(name) {
            var $panel = $('#' + name, $sidebarContainer),
            $icon = $('.ui-layout-sidebar-nav-icon[name=' + name + ']', $sidebarNav);
            $('.didgeridoo-panel-window', $sidebarContainer).css('display', 'none');
            $panel.css('display', 'block');
            $('.ui-layout-sidebar-nav-icon', $sidebarNav).removeClass('active');
            $icon.addClass('active');
            
            if(!sidebarIsExpanded) {
                _openSidebar();
            }
            
            didgeridoo.observer.publish('layout.sidebar.panel.selected', {
                'name': name,
                'icon': $icon.get(0),
                'el': $( '.didgeridoo-panel-window-content', $panel.get(0) ).get(0)
            });
        };
        
        var _openSidebar = function() {
            $sidebar.removeClass('ui-layout-sidebar-collapsed')
            .addClass('ui-layout-sidebar-opened');
            
            $sidebar.width($sidebar.data('width') || null);
            $sidebarContainer.css('display', 'block');
        };
        
        var _closeSidebar = function() {
            $sidebar.removeClass('ui-layout-sidebar-opened')
            .removeClass('ui-layout-sidebar-expanded')
            .addClass('ui-layout-sidebar-collapsed');
            
            $sidebar.css('width', '');
            
            $sidebarContainer.css('display', 'none');
            
            $('.ui-layout-sidebar-nav-icon-collapse').removeClass('ui-layout-sidebar-nav-icon-collapse-expanded');
            
            didgeridoo.observer.publish('layout-sidebar.resized', null);
            didgeridoo.observer.publish('layout.resize', null);
        };
        
        
        //Public interface for Sidebar
        return {
            getPanel: function() {
                return $sidebar.get(0);
            },
            getPanelContainer: function() {
                return $sidebarContainer.get(0);
            },
            selectPanel: _selectPanel,
            addPanel: _addPanel,
            removePanel: _removePanel
        };
    }; //end of _sidebar
    
    
    //
    //Event handlers for Sidebar
    //
    
    var layoutSidebarResize = function(ui) {
        if(!$sidebar.hasClass('ui-layout-sidebar-opened')) {
            $centerPanel.css('left', $sidebar.outerWidth(true));
            $sidebar.css('height', 'auto');
        }
    };
    
    
    $sidebar.resizable({
        handles: 'e',
        minWidth: 200,
        stop: function(evt, ui) {
            $sidebar.data('width', $sidebar.css('width'));
            didgeridoo.observer.publish('layout-sidebar.resized', ui);
            didgeridoo.observer.publish('layout.resized', ui);
            sidebarIsResizing = false;
        },
        resize: function(evt, ui) {
            didgeridoo.observer.publish('layout-sidebar.resizing', ui);
            didgeridoo.observer.publish('layout.resizing', ui);
            sidebarIsResizing = true;
        }
    });
    
    
    
    // Populate module to didgeridoo object
    didgeridoo.layout = {
        getNorthPanel: function() {
            return $northPanel.get(0);
        },
        getSideBar: _sidebar,
        getCenterPanel: function() {
            return $centerPanel.get(0);
        }
    };

    //Public interface
    return didgeridoo.layout;
	
});