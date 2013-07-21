define(['modules/ui/layout/layout'], function() {

	didgeridoo.Action.register('FileClose', function(documentId) {
		if( typeof documentId === 'undefined' ) {
			//current document
			var $selectedTab = $('.ui-state-active a', didgeridoo.layout.getCenterPanel());

			if( $selectedTab.length > 0 ) {
				documentId = $selectedTab[0].hash.substring(1);
			} else {
				return;
			}

			if( typeof documentId === 'undefined' ) { return; }
		}

		delete didgeridoo.documents[documentId];
		didgeridoo.documents.currentDocument = null;
		
        $(didgeridoo.layout.getCenterPanel()).tabs( 'remove', '#' + documentId );
		
        didgeridoo.observer.publish('document.close', documentId);
	});

});