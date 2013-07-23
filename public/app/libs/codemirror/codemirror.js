define([
	'require',
	'libs/codemirror/mode/clike/clike',
	'libs/codemirror/mode/xml/xml',
	'libs/codemirror/mode/css/css',
	'libs/codemirror/mode/javascript/javascript',
	'libs/codemirror/mode/htmlmixed/htmlmixed',
	'libs/codemirror/addons/active-line',
	'api/util/css/css'
	], function(require) {

	var cssFile = require.toUrl('./lib/codemirror.css');
		didgeridoo.api.util.css.load(cssFile);

	var themeFile = require.toUrl('./theme/monokai.css');
		didgeridoo.api.util.css.load(themeFile);
	
}); //end of define