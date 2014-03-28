define([
'API.Action',
'API.Event',
'layout'
], function() {

	didgeridoo.api.action.register('FileClose', function(documentId) {
		if( typeof documentId === 'undefined' ) {
			var selectedTab = didgeridoo.layout.centerPanelTabs.tabListElement.querySelector('.active').querySelector('[role=tab]');

			if( selectedTab ) {
				documentId = selectedTab.getAttribute('rel');
			} else {
				return;
			}

			if( typeof documentId === 'undefined' ) { return; }
		}

		delete didgeridoo.documents[documentId];
		didgeridoo.documents.currentDocument = null;
		
        didgeridoo.layout.centerPanelTabs.remove(documentId);
		
        didgeridoo.api.event.publish('document.close', documentId);
	});

});