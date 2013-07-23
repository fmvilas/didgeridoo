"use strict";

/**
 * Event API
 *
 * Based on the Pub/Sub implementation by Addy Osmani
 * http://addyosmani.com/
 * https://github.com/addyosmani/pubsubz
 * http://jsfiddle.net/LxPrq/
 * Licensed under the GPL
 *
 * @module api/event/event
 */
define(['core'], function() {

    createNS('didgeridoo.api');

    didgeridoo.api.event = (function() {


        var topics = {},
        subUid = -1;

        var _publish = function ( topic, args ) {

            if (!topics[topic]) {
                return false;
            }

            setTimeout(function () {
                var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;

                while (len--) {
                    subscribers[len].func(topic, args);
                }
            }, 0);

            return true;

        };

        var  _subscribe = function ( topic, func ) {

            var tokens = [];

            topic = topic.split(',');
            for(var i=0; i < topic.length; i++) {
                topic[i] = topic[i].trim();
            }

            for(var i=0; i < topic.length; i++) {
                if (!topics[topic[i]]) {
                    topics[topic[i]] = [];
                }

                var token = (++subUid).toString();
                topics[topic[i]].push({
                    token: token,
                    func: func
                });

                tokens.push(token);
            }

            return tokens;
        };

        var  _unsubscribe = function ( token ) {
            for (var m in topics) {
                if (topics[m]) {
                    for (var i = 0, j = topics[m].length; i < j; i++) {
                        if (topics[m][i].token === token) {
                            topics[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        };



        return {
            publish: _publish,
            subscribe: _subscribe,
            unsubscribe: _unsubscribe
        };

    })();


    return didgeridoo.api.event;

});