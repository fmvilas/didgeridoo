"use strict";
define(['require'], function(require) {

	didgeridoo.Action.register('FileSave', function(path) {
		if( didgeridoo.documents.currentDocument ) {
			didgeridoo.documents.currentDocument.save(path);
		} else {
			return;
		}
	});

});