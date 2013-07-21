"use strict";
define(['require'], function(require) {

	didgeridoo.Action.register('FileNew', function() {
		require(['modules/ui/document/Document'], function(Document) {
			new Document().load();
		});
	});

});