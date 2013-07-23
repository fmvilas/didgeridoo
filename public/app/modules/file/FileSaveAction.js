"use strict";

define(['require', 'action'], function(require) {

	didgeridoo.api.action.register('FileSave', function(path) {
		if( didgeridoo.documents.currentDocument ) {
			didgeridoo.documents.currentDocument.save(path);
		} else {
			return;
		}
	});

});