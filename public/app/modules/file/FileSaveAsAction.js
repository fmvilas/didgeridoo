"use strict";

define(['require', 'API.Action'], function(require) {

	didgeridoo.api.action.register('FileSaveAs', function() {
		require(['modules/file/dialog/FileSaveAs'], function(FileSaveAsDialog) {
			FileSaveAsDialog.show();
		});
	});

});