"use strict";
define([
    'require',
    'text!./main.html',
    'underscore',
    'API.Action',
    'API.Event',
    'layout',
    'dynatree'
], function(require, html, _) {

    var moduleName = 'ProjectExplorer',
        $tree,
        $empty,
        $error,
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

    var _createTree = function(files) {
        _.each(files, function(file, index) {
            files[index].isLazy = file.isFolder;
        });

        files = [{
            'title': didgeridoo.api.project.currentProject.name,
            'key': '/',
            'size': 0,
            'modified': null,
            'expand': true,
            'isFolder': true,
            'isLazy': true,
            'children': files
        }];

        $empty.css('display', 'none');

        $tree.css('display', 'block').dynatree({
            children: files,
            debugLevel: 0,
            classNames: {
                nodeIcon: 'dynatree-icon file-type-icon'
            },
            onPostInit: function() {
                var node = this.getNodeByKey('/');
                
                if(node) node.sortChildren(_compareFunction, true);
            },
            onLazyRead: function(node) {
                $.ajax({
                    url: '/p/' + didgeridoo.api.project.currentProject.id + '/f',
                    type: 'GET',
                    data: {
                        query: {
                            path: node.data.key,
                            hidden: true
                        }
                    },
                    success: function(files) {
                        _hideError();
                        _.each(files, function(file, index) {
                            files[index].isLazy = file.isFolder;
                        });
                        node.addChild(files).sortChildren(_compareFunction, true);
                    },
                    error: function(err) {
                        $error.html('There was an error while trying to load the tree.');
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
        });
        
        $tree.dynatree('getRoot').sortChildren(_compareFunction, true);
    };
    
    var _render = function(selector) {
        if( isRendered ) return;

        var $selector = $(selector);

        $selector.html(html);
        
        $tree = $('.didgeridoo-project-explorer-tree-wrapper', $selector);
        $empty = $('.didgeridoo-project-explorer-empty', $selector);
        $error = $('.didgeridoo-project-explorer-error', $selector);

        if( didgeridoo.api.project.currentProject && didgeridoo.api.project.currentProject.id ) {
            $.ajax({
                url: '/p/' + didgeridoo.api.project.currentProject.id + '/f',
                type: 'GET',
                data: {
                    query: {
                        hidden: true
                    }
                },
                success: function(files) {
                    _hideError();
                    _createTree(files);
                    isRendered = true;
                    didgeridoo.api.event.publish(moduleName + '.rendered');
                },
                error: function(err) {
                    _showError('There was an error while trying to load the tree.');
                }
            });
            
        }
    };

    var _showError = function(msg) {
        $error.html(msg).show();
    };

    var _hideError = function() {
        $error.hide();
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