define(['action'], function() {

	didgeridoo.api.action.register('FileCloseAll', function() {
		for(documentId in didgeridoo.documents) {
			didgeridoo.api.action.do('FileClose', documentId);
		}
	});

});