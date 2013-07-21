"use strict";
define(['require', 'text!./main.html', 'modules/ui/layout/layout', 'moment', 'dynatree'], function(require, html) {

    var moduleName = 'didgeridoo-project-explorer';
        
    var ProjectExplorer = function() {
        
        var $tree,
        isRendered = false;

        var _compareFunction = function(a, b) {
            if( (a.data.isFolder && b.data.isFolder) || (!a.data.isFolder && !b.data.isFolder) ) {
                a = a.data.title.toLowerCase();
                b = b.data.title.toLowerCase();
            } else {
                return a.data.isFolder ? -1 : 1;
            }
            
            return a > b ? 1 : a < b ? -1 : 0;
        };
        
        var _render = function(selector) {

            if( isRendered ) return;

            //Add HTML
            $(selector).append(html);

            $('#didgeridoo-project-explorer-tree-wrapper').dynatree({
                debugLevel: 0,
                classNames: {
                    nodeIcon: 'dynatree-icon file-type-icon'
                },
                initAjax: {
                    url: '/p/' + didgeridoo.currentProject + '/f'
                },
                onPostInit: function() {
                    var node = this.getNodeByKey('/');
                    
                    if(node) node.sortChildren(_compareFunction, true);
                },
                onLazyRead: function(node){
                    node.appendAjax({
                        url: '/p/' + didgeridoo.currentProject + '/f',
                        data: {
                            directory: node.data.key
                        },
                        success: function() {
                            if(node && node.tree) {
                                var n = node.tree.getNodeByKey('/'+didgeridoo.currentProject+'/');

                                if(n) n.sortChildren(_compareFunction, true);
                            }
                        }
                    });
                },
                fx: {
                    height: "toggle",
                    duration: 200
                },
                clickFolderMode: 1,
                onDblClick: function(node) {
                    if( node.data.isFolder ) {
                        node.expand(!node.isExpanded());
                    } else {
                        didgeridoo.Action.do('FileOpen', node.data.key);
                    }
                }
            }).dynatree('getRoot').sortChildren(_compareFunction, true);
            
            isRendered = true;

            didgeridoo.observer.publish(moduleName + '.rendered');
        };
        
        didgeridoo.observer.subscribe('layout.sidebar.panel.selected', function(topic, info) {
            if(info.name === moduleName) {
                _render(info.el);
            }
        });
        
        
        
        
        
        return {
            id: 'didgeridoo-project-explorer',
            title: 'Project Files',
            iconClass: 'icon32 icon32-folder-open',
            renderTo: _render
        };
        
    };
    
    
    
    
    
    return new ProjectExplorer();
});