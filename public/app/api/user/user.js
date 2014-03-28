"use strict";

/**
 * User API
 *
 * @module api/user/user
 */
define(['core', 'jquery'], function() {
	
	createNS('didgeridoo.api.user');

	/**
	 * Returns user information.
	 * @param {string} [userid] (Optional) The id of the user you want to retrieve information. Default: 0 (logged user).
	 * @param {function} callback Callback function to perform once user information is retrieved.
	 */
	didgeridoo.api.user.get = function() {

		var url,
			cb,
			userid;

		if( arguments.length === 0 ) {
			throw new didgeridoo.api.user.UserGetError('Too few parameters on <didgeridoo.api.user.get> call.');
		} else if( arguments.length === 1 ) {
			assert(typeof arguments[0] === 'function', 'Parameter callback must be a function.', didgeridoo.api.user.UserGetError);

			userid = '0';
			url = '/u/0'; // Zero belongs to the current user.
			cb = arguments[0];
		} else if( arguments.length === 2 ) {
			assert(typeof arguments[0] === 'string', 'Parameter userid must be a string.', didgeridoo.api.user.UserGetError);
			assert(arguments[0].trim().length > 0, 'Invalid userid parameter.', didgeridoo.api.user.UserGetError);
			assert(typeof arguments[1] === 'function', 'Parameter callback must be a function.', didgeridoo.api.user.UserGetError);
			userid = arguments[0];
			url = '/u/' + userid;
			cb = arguments[1];
		} else {
			throw new didgeridoo.api.user.UserGetError('Too much parameters on <didgeridoo.api.user.get> call.');
		}


		$.ajax({
			url: url,
			type: 'GET',
			data: {
				format: 'json'
			},
			success: function(User) {
				didgeridoo.api.user.currentUser = User;
				cb.apply(this, [User]);
			},
			error: function() {
				throw new didgeridoo.api.user.UserGetError('Couldn\'t get user with id "' + userid + '".');
			}
		});

	};


	/**
     * Error while performing {@link didgeridoo.api.user.get} operation.
     * @param {string} [message] Message to display.
     */
    didgeridoo.api.user.UserGetError = function(message) {
        this.name = 'UserGetError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    didgeridoo.api.user.UserGetError.prototype = new Error();
    didgeridoo.api.user.UserGetError.prototype.constructor = didgeridoo.api.user.UserGetError;

	return didgeridoo.api.user;

});