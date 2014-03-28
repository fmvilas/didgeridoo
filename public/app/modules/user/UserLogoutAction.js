define(['API.Action'], function() {

	didgeridoo.api.action.register('UserLogout', function() {
		window.location = '/logout';
	});

});