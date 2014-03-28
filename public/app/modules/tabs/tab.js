"use strict";

define([
    'require',
    'text!./tab.html',
    'underscore',
    'jquery',
    'core',
    'API.Action',
    'API.Event'
], function(require, tmpl) {
    
    var moduleName = 'Tab',
        href,
        label,
        containerElement,
        tabTemplate,
        tabContent;


    var Tab = function(h, l, content, c) {
        assert(typeof h === 'string', 'Tab href parameter must be a String.');
        assert(typeof l === 'string', 'Tab label must be a String.');
        assert(typeof content === 'string', 'Tab content must be a String.');
        assert(c instanceof HTMLElement, 'Tab container must be a HTMLElement.');

        tabTemplate = _.template(tmpl);

        href = h;
        label = l;
        tabContent = content;
        containerElement = c;
        this.render();
    };

    Tab.prototype.render = function() {
        var list = containerElement.querySelector('[role="tablist"]'),
            html = this.toHTML(),
            li = document.createElement('li'),
            panel = document.createElement('div');

        li.setAttribute('role', 'tab');
        li.innerHTML = html;

        /*li.querySelector('.ui-icon-close').addEventListener('click', function() {
            didgeridoo.api.action.do('TabClose', href);
        });*/
        list.appendChild(li);
        this.tabElement = li;

        panel.setAttribute('rel', href);
        panel.setAttribute('role', 'tabpanel');
        panel.innerHTML = tabContent;
        containerElement.appendChild( panel );
        this.panelElement = panel;

        return this;
    };

    Tab.prototype.toHTML = function() {
        return tabTemplate({
            href: href,
            label: label
        });
    };

    return Tab;
	
});