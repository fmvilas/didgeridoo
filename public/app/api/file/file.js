"use strict";

/**
 * File API
 *
 * @module api/file/file
 */
define(['core', 'API.User'], function() {

	createNS('didgeridoo.api.file');

	var filesDB;

	// Request for IndexedDB storage to cache files if possible
	/*if( window.indexedDB ) {
		var request = window.indexedDB.open(didgeridoo.api.user.currentUser.email + '-files', 1);

		request.onerror = function(event) {
			// Silently don't allow for caching files
			filesDB = null;
		};
		request.onsuccess = function(event) {
			filesDB = request.result;
		};
	}*/

	/**
	 * Retrieves content of a given file.
	 *
	 * @param {string} path The id of the file you want to retrieve information.
	 * @param {string} pid The id of the project which contains the file.
	 * @param {function} callback Callback function to perform once file information is retrieved.
	 */
	didgeridoo.api.file.getContent = function() {

		var args = arguments,
			path,
			url,
			cb,
			pid;

		if( args.length < 3 ) {
			throw new didgeridoo.api.file.FileGetContentError('Too few parameters on <didgeridoo.api.file.getContent> call.');
		} else if( args.length === 3 ) {
			assert(typeof args[0] === 'string', 'Parameter path must be a string.', didgeridoo.api.file.FileGetContentError);
			assert(args[0].trim().length > 0, 'Invalid path parameter.', didgeridoo.api.file.FileGetContentError);
			assert(typeof args[1] === 'string', 'Parameter pid must be a string.', didgeridoo.api.file.FileGetContentError);
			assert(args[1].trim().length > 0, 'Invalid pid parameter.', didgeridoo.api.file.FileGetContentError);
			assert(typeof args[2] === 'function', 'Parameter callback must be a function.', didgeridoo.api.file.FileGetContentError);
			path = args[0];
			pid = args[1];
			url = '/p/' + pid + '/f/' + path;
			cb = args[2];
		} else {
			throw new didgeridoo.api.file.FileGetContentError('Too much parameters on <didgeridoo.api.file.getContent> call.');
		}

		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'text',
			success: function(content) {

				cb.apply(this, [content]);
			},
			error: function() {
				throw new didgeridoo.api.file.FileGetContentError('Couldn\'t get file with "' + path + '".');
			}
		});

	};


	/**
     * Error while performing {@link didgeridoo.api.file.getContent} operation.
     * @param {string} [message] Message to display.
     */
    didgeridoo.api.file.FileGetContentError = function(message) {
        this.name = 'FileGetContentError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    didgeridoo.api.file.FileGetContentError.prototype = new Error();
    didgeridoo.api.file.FileGetContentError.prototype.constructor = didgeridoo.api.file.FileGetContentError;

    /**
     * Error while performing {@link didgeridoo.api.file.open} operation.
     * @param {string} [message] Message to display.
     */
    didgeridoo.api.file.FileOpenError = function(message) {
        this.name = 'FileOpenError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    didgeridoo.api.file.FileOpenError.prototype = new Error();
    didgeridoo.api.file.FileOpenError.prototype.constructor = didgeridoo.api.file.FileOpenError;

	return didgeridoo.api.file;

});