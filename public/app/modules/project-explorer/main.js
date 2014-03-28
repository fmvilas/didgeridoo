"use strict";
define([
    'require',
    'text!./main.html',
    'API.Action',
    'API.Event',
    'layout',
    'dynatree'
], function(require, html) {

    var moduleName = 'ProjectExplorer',
        $tree,
        $empty,
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

    var _createTree = function() {
        $empty.css('display', 'none');
        
        $tree.css('display', 'block').dynatree({
            debugLevel: 0,
            classNames: {
                nodeIcon: 'dynatree-icon file-type-icon'
            },
            initAjax: {
                url: '/p/' + didgeridoo.api.project.currentProject.id + '/f'
            },
            onPostInit: function() {
                var node = this.getNodeByKey('/');
                
                if(node) node.sortChildren(_compareFunction, true);
            },
            onLazyRead: function(node){
                node.appendAjax({
                    url: '/p/' + didgeridoo.api.project.currentProject.id + '/f',
                    data: {
                        directory: node.data.key
                    },
                    success: function() {
                        if(node && node.tree) {
                            var n = node.tree.getNodeByKey('/'+didgeridoo.api.project.currentProject.id+'/');

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
                    didgeridoo.api.action.do('FileOpen', node.data.key);
                }
            }
        }).dynatree('getRoot').sortChildren(_compareFunction, true);
    };
    
    var _render = function(selector) {
        if( isRendered ) return;

        var $selector = $(selector);

        $selector.html(html);
        
        $tree = $('.didgeridoo-project-explorer-tree-wrapper', $selector);
        $empty = $('.didgeridoo-project-explorer-empty', $selector);

        if( didgeridoo.api.project.currentProject && didgeridoo.api.project.currentProject.id ) {
            _createTree();
        }
        
        isRendered = true;

        didgeridoo.api.event.publish(moduleName + '.rendered');
    };
    
    didgeridoo.api.event.subscribe('layout.sidebar.panel.selected', function(topic, info) {
        if(info.name === moduleName) {
            _render(info.el);
        }
    });

    didgeridoo.api.event.subscribe('didgeridoo.api.project.open', function() {
        $empty.css('display', 'none');
        _createTree();
    });

    didgeridoo.api.event.subscribe('didgeridoo.api.project.close', function() {
        $empty.css('display', 'block');
        $tree.html('').css('display', 'none').removeData('dynatree');
    });
    
    
    
    
    
    return {
        id: 'didgeridoo-project-explorer',
        title: 'Project Files',
        iconClass: 'icon32 icon32-folder-open',
        renderTo: _render
    };
    
});