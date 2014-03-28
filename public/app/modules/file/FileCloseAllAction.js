define(['API.Action'], function() {

	didgeridoo.api.action.register('FileCloseAll', function() {
		for(documentId in didgeridoo.documents) {
			didgeridoo.api.action.do('FileClose', documentId);
		}
	});

});