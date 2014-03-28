"use strict";

define([
    'require',
    'tab',
    'text!./tabs.css',
    'core',
    'API.Action',
    'API.Event',
    'API.Util',
    'jquery.ui.sortable'
], function(require, Tab, css, didgeridoo) {
    
    var moduleName = 'Tabs',
        tabCollection = [],
        defaultClass = 'doo-widget-tabs';

    didgeridoo.api.util.css.insert(css);

    var Tabs = function(options) {
        assert(options.el instanceof HTMLElement, 'Tabs element must be a HTMLElement.');
        assert(typeof options.cssClass === 'string' ||
                typeof options.cssClass === 'undefined', 'cssClass parameter must be a string.');
        assert(typeof options.id === 'string' ||
                typeof options.id === 'undefined', 'id parameter must be a string.');

        var ul = document.createElement('ul');
        if( options.id ) ul.setAttribute('id', options.id);
        if( options.cssClass ) {
            ul.setAttribute('class', defaultClass + ' ' + options.cssClass);
        } else {
            ul.setAttribute('class', defaultClass);
        }
        ul.setAttribute('role', 'tablist');
        ul.setAttribute('unselectable', 'on');
        options.el.appendChild(ul);
        $(ul).sortable({
            axis: 'x',
            handle: 'button',
            cancel: '', // this prevents buttons from cancelling sort operation
            forceHelperSize: true,
            forcePlaceholderSize: true
        });

        this.tabsElement = options.el;
        this.tabListElement = ul;
    };

    Tabs.prototype.add = function(href, label, content) {
        var tab,
            self = this;

        if( typeof content !== 'string' ) {
            tab = new Tab(href, label, '', this.tabsElement);
        } else {
            tab = new Tab(href, label, content, this.tabsElement);
        }

        tab.tabElement.querySelector('.close').addEventListener('click', function() {
            self.remove(tab);
        });
        tab.tabElement.querySelector('[role=tab]').addEventListener('click', function() {
            self.select(tab);
        });

        tabCollection.push(tab);
        this.select(tab);

        return tab;
    };

    Tabs.prototype.select = function(t) {
        if( t instanceof Tab ) {
            tabCollection.forEach(function(el) {
                el.tabElement.classList.toggle('active', el === t);
                el.panelElement.classList.toggle('active', el === t);
            }, this);
        } else if( typeof t === 'string' ) {
            tabCollection.forEach(function(el) {
                el.tabElement.classList.toggle('active', el.tabElement.querySelector('[role=tab]').getAttribute('rel') === t);
                el.panelElement.classList.toggle('active', el.panelElement.getAttribute('rel') === t);
            }, this);
        } else if( typeof t === 'number' ) {
            tabCollection.forEach(function(el, index) {
                el.tabElement.classList.toggle('active', index === t);
                el.panelElement.classList.toggle('active', index === t);
            }, this);
        }
        
    };

    Tabs.prototype.remove = function(t) {
        if( t instanceof Tab ) {
            var li = t.tabElement,
                panel = t.panelElement;

            tabCollection.splice(tabCollection.indexOf(t), 1);
            t.tabElement.parentNode.removeChild(li);
            this.tabsElement.removeChild(panel);
        } else if( typeof t === 'string' ) {
            tabCollection.forEach(function(el, index) {
                if( el.tabElement.querySelector('[role=tab]').getAttribute('rel') === t ) {
                    el.tabElement.parentNode.removeChild(el.tabElement);
                    this.tabsElement.removeChild(el.panelElement);
                    tabCollection.splice(index, 1);
                    return;
                }
            }, this);
        } else if( typeof t === 'number' ) {
            tabCollection[t].tabElement.parentNode.removeChild(tabCollection[t].tabElement);
            this.tabsElement.removeChild(tabCollection[t].panelElement);
        }
        
    };

    // Should close all tabs
    Tabs.prototype.removeAll = function() {
        tabCollection.forEach(this.remove, this);
    };

    return Tabs;
	
});