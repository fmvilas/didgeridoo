"use strict";

define(['require', 'API.Action'], function(require) {

	didgeridoo.api.action.register('ProjectShowAllProjects', function() {
		$(didgeridoo.layout.centerPanel).tabs( 'add', '#ProjectShowAllProjects', 'Show All Projects' );
	});

});