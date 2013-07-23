define(['action'], function() {

	didgeridoo.api.action.register('UserLogout', function() {
		window.location = '/logout';
	});

});