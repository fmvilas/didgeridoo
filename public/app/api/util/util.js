"use strict";

/**
 * Util API
 *
 * @module api/util/util
 */
define(['core'], function() {

	createNS('didgeridoo.api.util');



    createNS('didgeridoo.api.util.css');

    /**
     * CSS Loader
     *
     * @param {string} cssFile The CSS file to load.
     */
    didgeridoo.api.util.css.load = function(cssFile) {
        var link = document.createElement('link');

        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', cssFile);
        
        document.head.appendChild(link);
    };

    /**
     * CSS Insert
     *
     * @param {string} css The CSS to insert inside <style> tag.
     */
    didgeridoo.api.util.css.insert = function(css) {
        var style = document.createElement('style');

        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        
        document.head.appendChild(style);
    };



    createNS('didgeridoo.api.util.html');

    /**
     * HTML Import
     *
     * @param {string} htmlFile The HTML file to import.
     */
    didgeridoo.api.util.html.import = function(htmlFile) {
        var link = document.createElement('link');

        link.setAttribute('rel', 'import');
        link.setAttribute('href', htmlFile);
        
        document.head.appendChild(link);
    };


    /**
     * System Info
     */
    didgeridoo.api.util.system = (function() {
        var _OS = navigator.platform,
            info = {
                cookie: $.cookie,
                cookieEnabled: navigator.cookieEnabled,
                language: navigator.language
            };

        if( _OS.indexOf('Win') != -1 ) {
            info.OS = 'Windows';
            return info;
        }

        if( _OS.indexOf('Mac') != -1 ) {
            info.OS = 'Mac';
            return info;
        }

        if( _OS.indexOf('Linux') != -1 ) {
            if( navigator.userAgent.indexOf('CrOS') != -1 ) {
                info.OS = 'Chrome OS';
                return info;
            } else {
                info.OS = 'Linux';
                return info;
            }
        }

        info.OS = 'Unknown';
        return info;
    })();

    return didgeridoo.api.util;

});