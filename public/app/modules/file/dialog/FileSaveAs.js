"use strict";
define(['require', 'modules/dialog/Dialog', 'text!./FileSaveAs.html', 'API.Action'], function(require, Dialog, html) {

    var modal,
        $tree,
        $btnSave,
        $txtFileName,
        $fileList;

	
	//current document
	var doc = didgeridoo.documents.currentDocument;

	var _makeTree = function() {
		$tree = $('#SaveAs-tree-wrapper').dynatree({
            debugLevel: 0,
            classNames: {
            	container: 'dynatree-container light-scrollbar',
            	nodeIcon: 'dynatree-icon file-type-icon'
            },
            initAjax: {
                url: '/p/' + didgeridoo.api.project.currentProject._id + '/f',
                data: {
                	list: 'folders'
                }
            },
            onPostInit: function() {
                var node = this.getNodeByKey('/');
                
                if(node) {
                    node.activate();
                    node.sortChildren(_compareFunction, true);
                }
            },
            onLazyRead: function(node){
                node.appendAjax({
                    url: '/p/' + didgeridoo.api.project.currentProject._id + '/f',
                    data: {
                    	list: 'folders',
                        directory: node.data.key
                    },
                    success: function() {
                        if(node && node.tree) {
                            var n = node.tree.getNodeByKey('/'+didgeridoo.api.project.currentProject._id+'/');

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
                }
            },
            onActivate: function(node) {
            	$.ajax({
            		url: '/p/' + didgeridoo.api.project.currentProject._id + '/f',
            		data: {
            			directory: node.data.key,
            			list: 'files'
            		},
            		success: function(data) {
            			_makeFileList(data);
            		},
            		error: function() {
            			console.log('Error while trying to list files on folder ' + node.data.key);
            		}
            	});
            }
        });

        $tree.dynatree('getRoot').sortChildren(_compareFunction, true);
	};

    var _makeFileList = function(data) {
        var url;

        $fileList = $('#SaveAs-file-list-body');

        $fileList.empty();

        _.each(data, function(item) {
            var $row = $(
                '<tr class="SaveAs-file-list-row ' + item.addClass + '" data-url="' + item.key + '">'+
                    '<td data-url="' + item.key + '"><i class="file-type-icon pull-left"></i> ' + item.title + '</td>'+
                '</tr>');

            $fileList.append($row);

            $row.on('click', function() {
                var $this = $(this);

                url = $this.data('url');
                $txtFileName.val(url);

                $('tr', $fileList).removeClass('selected');
                $this.addClass('selected');

                $txtFileName.trigger('change');
            });

            $row.on('dblclick', _save);
        });
    };

    var _save = function() {
        if( $txtFileName.val().trim() !== '' ) {
            var url = $txtFileName.val();

            if( url.substring(0,1) !== '/' &&
                url.substring(0,2) !== '..' ) {

                url = $tree.dynatree('getActiveNode').data.key + url;

            } else if( url.substring(0,2) === '..' ) {
                console.dir('Error');
                return;
            }

            didgeridoo.api.action.do('FileSave', url);
            modal.hide();
        }
    };

	var _compareFunction = function(a, b) {
        if( (a.data.isFolder && b.data.isFolder) || (!a.data.isFolder && !b.data.isFolder) ) {
            a = a.data.title.toLowerCase();
            b = b.data.title.toLowerCase();
        } else {
            return a.data.isFolder ? -1 : 1;
        }
        
        return a > b ? 1 : a < b ? -1 : 0;
    };

    if( doc ) {
        modal = new Dialog('FileSaveAsDialog', html);
        $btnSave = $('.btn-primary', '#' + modal.id);
        $txtFileName = $('#SaveAs-file-name');

        _makeTree();

        $txtFileName.on('keydown', function(key) {
            if( key.keyCode === 13 ) { //Enter
                _save();
            }
        });

        $txtFileName.on('keyup change', function(key) {
            if( $txtFileName.val().trim().length > 0 ) {
                $btnSave.removeClass('disabled');
            } else {
                $btnSave.addClass('disabled');
            }
        });

        if( doc.getURL() && doc.getURL().trim().length > 0 ) {
            $txtFileName.val( doc.getURL() );
            $txtFileName.trigger('change');
        }

        $btnSave.click(_save);
    } else {
        /* TODO: Better error message */
        console.log('error');
    }



    return modal;

});