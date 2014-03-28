define([
	'require',
	'components/codemirror/mode/clike/clike',
	'components/codemirror/mode/xml/xml',
	'components/codemirror/mode/css/css',
	'components/codemirror/mode/javascript/javascript',
	'components/codemirror/mode/htmlmixed/htmlmixed',
	'components/codemirror/addon/selection/active-line',
	'api/util/css/css'
	], function(require) {

	var cssFile = require.toUrl('components/codemirror/lib/codemirror.css');
		didgeridoo.api.util.css.load(cssFile);

	var themeFile = require.toUrl('components/codemirror/theme/monokai.css');
		didgeridoo.api.util.css.load(themeFile);
	
}); //end of define