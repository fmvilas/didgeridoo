"use strict";
define(function() {
	
	var module,
		config,
		moduleName = 'didgeridoo-basicmodule';
	
	var tokens = didgeridoo.observer.subscribe(moduleName + '.loaded', function(topic, m) {
		module = m;
		config = m.originalConfig;
		
		didgeridoo.observer.unsubscribe(tokens[0]);
		didgeridoo.observer.publish(moduleName + '.ready', m);
	});
	
	var BasicModule = function() {
		if ( !(this instanceof BasicModule) )
      		return new BasicModule();
      	
      	
		var _myPublicMethod = function() {
			/* Do something public */
		};
		
		var _renderTo = function(selector, callback) {
			
			var	files = config.files,
				instance = this;	
			
			$.ajax({
				url: config.url + files.html.main,
				success: function(data) {
					$container = $(selector);
					$container.html(data);
										
					didgeridoo.observer.publish(moduleName + '.rendered', instance);
					
					if(callback) {
						callback();
					}
				},
				error: function(jqXHR, status, errorThrown) {
					didgeridoo.utils.logger.warn(
						'Oops! Didgeridoo couldn\'t load the "' + config.id + '" module.\n'+
						'Error details:\n  Status Text: ' + status + '\n  Error Thrown: ' + errorThrown
					);
				}
			});
			
			$('head').append('<link rel="stylesheet" href="' + config.url + files.css.main  + '">');
			
			return this;
			
		};
		
		
		//Public interface
		return {
			myMethod: _myPublicMethod,
			renderTo: _renderTo
		};
	
	
	}; //end of BasicModule()
	
	
	
	return BasicModule;
	
	    
}); //end of define