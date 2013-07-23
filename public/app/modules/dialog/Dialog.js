define(function() {

	var _dialogHtml = '<div class="modal hide fade" tabindex="-1"></div>';

	return function(id, content) {
		var $dialog = $('#'+id).length > 0 ? $('#'+id) : $(_dialogHtml);

	    $dialog.attr('id', id)
	    		.appendTo('body')
	    		.html(content)
	    		.modal({
	    			show: false
	    		});

	    return {
	    	id: id,
	    	hide: function() {
	    		$dialog.modal('hide');
	    	},
	    	show: function() {
	    		$dialog.modal('show');
	    	}
	    };
    };

});