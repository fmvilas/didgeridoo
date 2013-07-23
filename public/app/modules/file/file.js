"use strict";

/**
 * File module
 *
 * @module modules/file/file
 */
define(['require'], function(require) {
	
	require([
		'modules/file/FileCloseAction',
		'modules/file/FileCloseAllAction',
		'modules/file/FileNewAction',
		'modules/file/FileOpenAction',
		'modules/file/FileSaveAction',
		'modules/file/FileSaveAsAction'
	]);

});