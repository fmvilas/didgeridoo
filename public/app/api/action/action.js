"use strict";

/**
 * Action API
 *
 * @module api/action/action
 */
define(['core'], function() {

    createNS('didgeridoo.api');

    didgeridoo.api.action = (function() {

        var _actions = [];

        //Register an action
        var _register = function(actionName, action) {
            assert( typeof actionName === 'string' &&
                    actionName.length > 0,
                    'actionName parameter must be a string.' );

            assert( typeof action === 'function',
                    'action parameter must be a function.' );

            if( _get(actionName) === null ) {
                _actions.push({
                    'name': actionName,
                    'action': action
                });
            } else {
                //throw error
            }
        };

        //Executes an action
        var _do = function(actionName, args) {
            var _action = _get(actionName);

            if( _action !== null ) {
                _action.action(args);
            } else {
                //throw error
            }
        };

        var _get = function(actionName) {
            for(var i=0; i < _actions.length; i++) {
                if( actionName === _actions[i].name ) {
                    return _actions[i];
                }
            }

            return null;
        };

        return {
            'register': _register,
            'do': _do,
            'get': _get
        };

    })();


    return didgeridoo.api.action;

});