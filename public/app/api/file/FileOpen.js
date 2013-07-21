"use strict";
define(['require'], function(require) {

	didgeridoo.Action.register('FileOpen', function(path) {
		require(['modules/ui/document/Document'], function(Document) {
			var type;

			if( path.match(/(\.html)|(\.htm)$/g) ) {
				type = 'HTML';
			} else if( path.match(/\.css$/g) ) {
				type = 'CSS';
			} else if( path.match(/\.js$/g) ) {
				type = 'JS';
			} else if( path.match(/\.php$/g) ) {
				type = 'PHP';
			} else if( path.match(/\.java$/g) ) {
				type = 'JAVA';
			} else {
				type = 'PlainText'
			}

			new Document(type).load('/p/' + didgeridoo.currentProject + '/f' + path);
		});
	});

});
