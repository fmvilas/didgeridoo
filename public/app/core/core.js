"use strict";

/**
 * Core
 *
 * @module core/core
 */
define(function() {

    var global = window;

    global.didgeridoo = global.didgeridoo || {};

    global.createNS = function(ns) {
        if( typeof ns === 'string' ) {

            var parts = ns.split('.');

            if( parts.length > 1 ) {

                if( !existNS(ns) ) {

                    var parent = global[parts[0]];

                    for( var i=1; i < parts.length; i++ ) {
                        if( typeof parent[parts[i]] === 'undefined' ) {
                            parent[parts[i]] = {};
                        }
                        
                        parent = parent[parts[i]];
                    }

                }

            } else {
                throw new NSCreateError('Invalid namespace.');
            }

        } else {
            throw new NSCreateError('Namespace is not specified or it must be a string.');
        }
    };

    global.existNS = function(ns) {
        var exist = true;

        if( typeof ns === 'string' ) {

            var parts = ns.split('.');

            if( parts.length > 1 ) {

                var parent = global[parts[0]];

                for( var i=1; exist && i < parts.length; i++ ) {
                    if( typeof parent[parts[i]] === 'undefined' ) {
                        exist = false;
                    } else {
                        parent = parent[parts[i]];
                    }
                }

            } else {
                exist = false;
            }

        } else {
            exist = false;
        }

        return exist;
    };

    /**
     * @global
     *
     * Error while creating namespace.
     * @param {string} [message] Message to display.
     */
    global.NSCreateError = function(message) {
        this.name = 'NSCreateError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    global.NSCreateError.prototype = new Error();
    global.NSCreateError.prototype.constructor = NSCreateError;
        



    /**
     * @global
     *
     * Throws an error with a message when the passed expression evaluates to false.
     * @param {boolean} expression The expression to evaluate.
     * @param {string} [message] (Optional) Message to show on error. Default: 'AssertConditionError ocurred!'.
     * @param {Error} [ErrorHandler] (Optional) Kind of error to raise. Must inherit from Error class. Default: {@link AssertConditionError}.
     */
    global.assert = function(exp) {
        var message,
            ErrorHandler;

        if( arguments.length < 2 ) {
            throw new AssertError('Too few parameters on <assert> call.');
        } else if( arguments.length === 2 ) {
            if( typeof arguments[1] !== 'string' ) {
                throw new AssertError('Message must be a string.');
            }

            message = arguments[1];
            ErrorHandler = AssertConditionError;
        } else if( arguments.length === 3 ) {
            if( typeof arguments[1] !== 'string' ) {
                throw new AssertError('Message must be a string.');
            }
            
            if( typeof arguments[2] === 'undefined' || arguments[2] === null ||
                typeof arguments[2].prototype !== 'object' ||
                !(arguments[2].prototype instanceof Error) ) {
                    throw new AssertError('ErrorHandler type must be Error.');
            }

            message = arguments[1];
            ErrorHandler = arguments[2];
        } else {
            throw new AssertError('Too much parameters on <assert> call.');
        }

        if( typeof exp !== 'boolean' ) throw new AssertError('Expression must be a boolean.');

        if (!exp) {
            throw new ErrorHandler(message);
        }
    };

    /**
     * @global
     *
     * Error raised when the passed expression to {@link assert} evaluates to false.
     * @param {string} [message] Message to display.
     */
    global.AssertConditionError = function(message) {
        this.name = 'AssertConditionError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    global.AssertConditionError.prototype = new Error();
    global.AssertConditionError.prototype.constructor = AssertConditionError;

    /**
     * @global
     *
     * Error while executing assert function.
     * @param {string} [message] Message to display.
     */
    global.AssertError = function(message) {
        this.name = 'AssertError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    };
    global.AssertError.prototype = new Error();
    global.AssertError.prototype.constructor = AssertError;



    return didgeridoo;
});
