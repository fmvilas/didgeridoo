"use strict";

/**
 * HTML Helper API
 *
 * @module api/util/html/html
 */
define(['core'], function() {

    createNS('didgeridoo.api.util.html');

    didgeridoo.api.util.html.import = function(htmlFile) {
        var link = document.createElement('link');

        link.setAttribute('rel', 'import');
        link.setAttribute('href', htmlFile);
        
        document.querySelector('head').appendChild(link);
    };

    return didgeridoo.api.util.html;

});