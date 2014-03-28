"use strict";

/**
 * Project API
 *
 * @module api/project/project
 */
define(['core'], function() {
	
	createNS('didgeridoo.api.project');

	/**
	 * Returns project information.
	 * @param {string} pid The id of the project you want to retrieve information.
	 * @param {function} callback Callback function to perform once project information is retrieved.
	 */
	didgeridoo.api.project.get = function() {

		var url,
			cb,
			pid;

		if( arguments.length < 2 ) {
			throw new didgeridoo.api.project.ProjectOpenError('Too few parameters on <didgeridoo.api.project.get> call.');
		} else if( arguments.length === 2 ) {
			assert(typeof arguments[0] === 'string', 'Parameter pid must be a string.', didgeridoo.api.project.ProjectGetError);
			assert(arguments[0].trim().length > 0, 'Invalid pid parameter.', didgeridoo.api.project.ProjectGetError);
			assert(typeof arguments[1] === 'function', 'Parameter callback must be a function.', didgeridoo.api.project.ProjectGetError);
			pid = arguments[0];
			url = '/p/' + pid;
			cb = arguments[1];
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
				didgeridoo.api.project.currentProject = Project;
				cb.apply(this, [Project]);
			},
			error: function() {
				throw new didgeridoo.api.project.ProjectGetError('Couldn\'t get project with id "' + pid + '".');
			}
		});

	};


	/**
	 * Open a project
	 * @param {string} pid The id of the project you want to open.
	 * @param {function} callback Callback function to perform once project is open.
	 */
	didgeridoo.api.project.open = function() {
		var url,
			cb,
			pid;

		if( arguments.length === 0 ) {
			throw new didgeridoo.api.project.ProjectOpenError('Too few parameters on <didgeridoo.api.project.open> call.');
		} else if( arguments.length === 1 ) {
			assert(typeof arguments[0] === 'string', 'Parameter pid must be a string.', didgeridoo.api.project.ProjectOpenError);
			assert(arguments[0].trim().length > 0, 'Invalid pid parameter.', didgeridoo.api.project.ProjectOpenError);
			pid = arguments[0];
			url = '/p/' + pid;
		} else {
			throw new didgeridoo.api.project.ProjectOpenError('Too much parameters on <didgeridoo.api.project.open> call.');
		}

		try {
			didgeridoo.api.project.get(pid, function(p) {
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