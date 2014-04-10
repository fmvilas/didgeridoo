"use strict";

/**
 * Project API
 *
 * @module api/project/project
 */
define(['core', 'API.Util'], function() {
	
	createNS('didgeridoo.api.project');

	/**
	 * Returns project information.
	 * @param {string} pid The id of the project you want to retrieve information.
	 * @param {function} callback Callback function to perform once project information is retrieved.
	 */
	didgeridoo.api.project.get = function() {

		var args = arguments,
			url,
			cb,
			pid;

		if( args.length < 2 ) {
			throw new didgeridoo.api.project.ProjectOpenError('Too few parameters on <didgeridoo.api.project.get> call.');
		} else if( args.length === 2 ) {
			assert(typeof args[0] === 'string', 'Parameter pid must be a string.', didgeridoo.api.project.ProjectGetError);
			assert(args[0].trim().length > 0, 'Invalid pid parameter.', didgeridoo.api.project.ProjectGetError);
			assert(typeof args[1] === 'function', 'Parameter callback must be a function.', didgeridoo.api.project.ProjectGetError);
			pid = args[0];
			url = '/p/' + pid;
			cb = args[1];
		} else {
			throw new didgeridoo.api.project.ProjectGetError('Too much parameters on <didgeridoo.api.project.get> call.');
		}

		$.ajax({
			url: url,
			type: 'GET',
			data: {
				format: 'json'
			},
			success: function(Project) {
				cb.apply(this, [Project]);
			},
			error: function(err) {
				throw new didgeridoo.api.project.ProjectGetError('Couldn\'t get project with id "' + pid + '".');
			}
		});

	};


	/**
	 * Returns an array of files for the given project.
	 * @param {string} pid The id of the project you want to retrieve the file array from.
	 * @param {function} callback Callback function to perform once file array is retrieved.
	 */
	didgeridoo.api.project.getFiles = function() {

		var args = arguments,
			url,
			query,
			cb,
			pid,
			isObject = didgeridoo.api.util.isObject;

		assert(typeof args[0] === 'string', 'Parameter pid must be a string.', didgeridoo.api.project.ProjectGetError);
		assert(args[0].trim().length > 0, 'Invalid pid parameter.', didgeridoo.api.project.ProjectGetError);
		pid = args[0];
		url = '/p/' + pid + '/f';

		if( args.length < 2 ) {
			throw new didgeridoo.api.project.ProjectGetError('Too few parameters on <didgeridoo.api.project.getFiles> call.');
		} else if( args.length === 2 ) {
			assert(typeof args[1] === 'function', 'Parameter callback must be a function.', didgeridoo.api.project.ProjectGetError);
			
			query = null;
			cb = args[1];
		} else if( args.length === 3 ) {
			assert(isObject(args[1], true), 'Parameter query must be an object.', didgeridoo.api.project.ProjectGetError);
			assert(typeof args[2] === 'function', 'Parameter callback must be a function.', didgeridoo.api.project.ProjectGetError);
			
			query = args[1];
			cb = args[2];
		} else {
			throw new didgeridoo.api.project.ProjectGetError('Too much parameters on <didgeridoo.api.project.getFiles> call.');
		}

		$.ajax({
			url: url,
			type: 'GET',
			data: {
				format: 'json',
				query: query
			},
			success: function(files) {
				cb.apply(this, [files]);
			},
			error: function(err) {
				throw new didgeridoo.api.project.ProjectGetError('Couldn\'t get project files.');
			}
		});

	};



	/**
	 * Open a project
	 * @param {string} pid The id of the project you want to open.
	 * @param {function} callback Callback function to perform once project is open.
	 */
	didgeridoo.api.project.open = function() {
		var args = arguments,
			url,
			cb,
			pid;

		if( args.length === 0 ) {
			throw new didgeridoo.api.project.ProjectOpenError('Too few parameters on <didgeridoo.api.project.open> call.');
		} else if( args.length === 1 ) {
			assert(typeof args[0] === 'string', 'Parameter pid must be a string.', didgeridoo.api.project.ProjectOpenError);
			assert(args[0].trim().length > 0, 'Invalid pid parameter.', didgeridoo.api.project.ProjectOpenError);
			pid = args[0];
			url = '/p/' + pid;
		} else {
			throw new didgeridoo.api.project.ProjectOpenError('Too much parameters on <didgeridoo.api.project.open> call.');
		}

		try {
			didgeridoo.api.project.get(pid, function(p) {
				didgeridoo.api.project.currentProject = p;
				didgeridoo.api.event.publish('didgeridoo.api.project.open', p);
			});
		} catch(e) {
			throw new didgeridoo.api.project.ProjectOpenError('Unable to open project.');
		}
	};


	/**
	 * Close current project.
	 */
	didgeridoo.api.project.close = function() {
		didgeridoo.api.project.currentProject = null;
		didgeridoo.api.event.publish('didgeridoo.api.project.close');
	};


	/**
     * Error while performing {@link didgeridoo.api.project.get} operation.
     * @param {string} [message] Message to display.
     */
    didgeridoo.api.project.ProjectGetError = function(message) {
        this.name = 'ProjectGetError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    didgeridoo.api.project.ProjectGetError.prototype = new Error();
    didgeridoo.api.project.ProjectGetError.prototype.constructor = didgeridoo.api.project.ProjectGetError;

    /**
     * Error while performing {@link didgeridoo.api.project.open} operation.
     * @param {string} [message] Message to display.
     */
    didgeridoo.api.project.ProjectOpenError = function(message) {
        this.name = 'ProjectOpenError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    didgeridoo.api.project.ProjectOpenError.prototype = new Error();
    didgeridoo.api.project.ProjectOpenError.prototype.constructor = didgeridoo.api.project.ProjectOpenError;

	return didgeridoo.api.project;

});