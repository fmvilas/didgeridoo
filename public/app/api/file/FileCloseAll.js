define(function() {

	didgeridoo.Action.register('FileCloseAll', function() {
		for(documentId in didgeridoo.documents) {
			didgeridoo.Action.do('FileClose', documentId);
		}
	});

});