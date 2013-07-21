"use strict";

define(['underscore'], function() {
	//Create namespace 'shortcut'
	didgeridoo.shortcut = {};

	didgeridoo.shortcut.map = [];

	var arrSpecialKeys = ['Cmd', 'Alt', 'AltGr', 'Ctrl', 'Shift'];

	var _strToKey = function(str) {
		var keys = str.split(/\s*\+\s*/),
			result = {
				key: null,
				specialKeys: []
			};

		keys = _.map(keys, function(item) {
			return item.trim();
		});
		
		_.each(keys, function(key) {
			var specialKey = _.findWhere(arrSpecialKeys, key);

			if( typeof specialKey !== 'undefined' &&
				specialKey === key ) {
				result.specialKeys.push(specialKey);
				keys = _.reject(keys, function(k) {
					if( k === key ) return true;
				});
			}
		});


		if( keys.length <= 0 && keys[0].length !== 1 ) {
			//throw ShorcutParseError
		}

		result.key = keys[0];

		return result;
	};
	
	didgeridoo.shortcut.exists = function(key) {
		return _.any(didgeridoo.shortcut.map, function(r) {
			return r.key === key;
		});
	};

	didgeridoo.shortcut.register = function(strKey, action) {
		if( !action ) {
			//throw ShortcutNoActionError
		}

		if( !didgeridoo.shortcut.exists(strKey) ) {
			var key = _strToKey(strKey);

			key.action = action;
			didgeridoo.shortcut.map.push( key );

			window.addEventListener('keydown', function(e) {
				var special = true;

				if( e.metaKey !== _.contains(key.specialKeys, 'Cmd') ||
					e.altKey !== _.contains(key.specialKeys, 'Alt') ||
					e.altGraphKey !== _.contains(key.specialKeys, 'AltGr') ||
					e.ctrlKey !== _.contains(key.specialKeys, 'Ctrl') ||
					e.shiftKey !== _.contains(key.specialKeys, 'Shift') ) {
						special = false;
				}

				if( String.fromCharCode(e.which) === key.key
					&& special === true) {
					e.preventDefault();
					if( typeof key.action === 'string' ) {
						didgeridoo.Action.do(key.action);
					} else if( typeof key.action === 'function' ) {
						key.action.apply(this);
					}
				}
			});
		} else {
			//throw ShorcutBusyError
		}
	};

});