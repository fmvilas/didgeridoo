"use strict";
define([
    'require',
    'text!./main.html', 
    'libraries/jqueryui/accordion', 
    'modules/ui/layout/layout'
    ], function(require, html) {

	
    var moduleName = 'Tools',
    cssFile = require.toUrl('./main.css');

    var Tools = (function() {

        var isRendered = false;

        var _render = function(selector) {
        
            if(isRendered === true) return;
            
            didgeridoo.utils.loadCSS(cssFile);

            var $panel = $(selector),
            listMarkup = '<li class="didgeridoo-tools-tool"><a>${name}</a></li>',
            groupMarkup = '<div id="didgeridoo-tools-group-${id}"><h3 class="didgeridoo-tools-group-header"><a class="didgeridoo-tools-group-header"><div class="icon" style="background-image:url(${icon});"></div><div class="text" style="background-color:${color};">${name}</div></a></h3><div class="light-scrollbar"><ul class="didgeridoo-tools-list"></ul></div></div>';
            
            var renderGroup = function(data) {
                var groupTemplate = $.template(null, groupMarkup),
                listTemplate = $.template(null, listMarkup);
                
                $.tmpl(groupTemplate, data).appendTo($panel);
                
                
                var g = $('.didgeridoo-tools-list', '#didgeridoo-tools-group-' + data.id);
                $.tmpl(listTemplate, data.tools).appendTo(g).click(function() {
                    var html = $(this).data().tmplItem.data.html;
                    
                    didgeridoo.observer.publish( moduleName + '.tool.select', html );
                });
            };
            
            
            
            var loadToolsFile = function(file) {
                $.ajax({
                    url: file,
                    dataType: 'json',
                    success: function(data) {
                        if(data && data.groups) {
                            for(var i = 0; i < data.groups.length; i++ ) {
                                if( data.groups[i].icon ) {
                                    data.groups[i].icon = require.toUrl( data.groups[i].icon );
                                }
                                renderGroup(data.groups[i]);
                            }
                            
                            $panel.accordion({
                                header: "> div > h3",
                                autoHeight: false,
                                collapsible: true,
                                change: function(ev, ui) {
                                    ui.newContent.css('overflow', 'auto');
                                }
                            })
                            .sortable({
                                axis: "y",
                                handle: "h3"
                            });
                            
                            isRendered = true;
                            didgeridoo.observer.publish(moduleName + '.rendered');
                        }
                    },
                    error: function(xhr, textstatus) {
                        console.dir(xhr);
                    }
                });
            };
            
            
            loadToolsFile( require.toUrl('./default.tools.json') );
        };
        
        
        didgeridoo.observer.subscribe('layout.sidebar.panel.selected', function(topic, info) {
            if(info.name === moduleName) {
                _render(info.el);
            }
        });
        
        return {
            id: 'Tools',
            title: 'Tools',
            classes: 'didgeridoo-tools',
            iconClass: 'icon32 icon32-tools',
            renderTo: _render
        };
    })();

    return Tools;


}); //end of define