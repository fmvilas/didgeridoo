"use strict";

/**
 * System API
 *
 * @module api/util/system/system
 */
define(['core'], function() {

    createNS('didgeridoo.api.util');

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


    return didgeridoo.api.util.system;

});