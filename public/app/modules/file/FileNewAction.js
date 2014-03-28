"use strict";

define(['require', 'API.Action'], function(require) {

	didgeridoo.api.action.register('FileNew', function() {
		require(['modules/document/Document'], function(Document) {
			new Document().load();
		});
	});

});