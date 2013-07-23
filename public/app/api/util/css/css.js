"use strict";

/**
 * CSS Helper API
 *
 * @module api/util/css/css
 */
define(['core'], function() {

    createNS('didgeridoo.api.util.css');

    didgeridoo.api.util.css.load = function(cssFile) {
        var link = document.createElement('link');

        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', cssFile);
        
        document.querySelector('head').appendChild(link);
    };

    return didgeridoo.api.util.css;

});