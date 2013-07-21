"use strict";

/**
 * Core
 *
 * @module core/core
 */
define(function() {

    var global = window,
        didgeridoo = {};

    global.createNS = function(ns) {
        if( typeof ns === 'string' ) {

            var parts = ns.split('.');

            if( parts.length > 1 ) {

                if( !existNS(ns) ) {

                    var parent = parts[0];

                    for( var i=1; exist && i < parts.length; i++ ) {
                        if( typeof parent[parts[i]] === 'undefined' ) {
                            parent[parts[i]] = {};
                        }
                        
                        parent = parts[i];
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

                var parent = parts[0];

                for( var i=1; exist && i < parts.length; i++ ) {
                    if( typeof parent[parts[i]] === 'undefined' ) {
                        exist = false;
                    } else {
                        parent = parts[i];
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
     * Error while creating namespace
     * @param {string} [message] Message to display
     */
    global.NSCreateError = function(message) {
        this.name = 'NSCreateError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    }
    global.NSCreateError.prototype = new Error();
    global.NSCreateError.prototype.constructor = global.NSCreateError;
        



    /**
     * Assert
     */
    global.assert = function(exp, message) {
        if (!exp) {
            throw new AssertError(message);
        }
    };

    /**
     * @global
     *
     * Error while executing assert function
     * @param {string} [message] Message to display
     */
    global.AssertError = function(message) {
        this.name = 'AssertError';
        this.message = typeof message !== 'undefined' ? this.name + ': ' + message : this.name + ' occurred!';
    }
    global.AssertError.prototype = new Error();
    global.AssertError.prototype.constructor = global.AssertError;

    return didgeridoo;
});
