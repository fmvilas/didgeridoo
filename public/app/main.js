require.config({
    baseUrl: '/app',
    paths: {
        //RequireJS plugins
        text: 'libs/require/plugins/text',
        //Didgeridoo modules and libs
        core: 'core/core',
        action: 'api/action/action',
        shortcut: 'api/shortcut/shortcut',
        'event': 'api/event/event',
        'util/system': 'api/util/system/system',
        user: 'api/user/user',
        jquery: 'libs/jquery/jquery.min',
        'jquery-cookie': 'libs/jquery-cookie/jquery.cookie',
        dynatree: 'libs/dynatree/jquery.dynatree-1.2.4',
        underscore: 'libs/underscore/underscore-min',
        bootstrap: 'libs/bootstrap/bootstrap',
        'jquery-tmpl': 'libs/jquerytemplates/jquery.tmpl.min',
        autoGrowInput: 'libs/autoGrowInput/autoGrowInput',
        codemirror_script: 'libs/codemirror/lib/codemirror',
        layout: 'modules/layout/layout'
    },
    shim: {
        'core': {
            deps: ['jquery', 'jquery-tmpl', 'jquery-cookie', 'bootstrap']
        },
        'libs/codemirror/codemirror': {
            deps: ['codemirror_script']
        },
        'dynatree': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery', 'underscore']
        },
        'jqueryui': {
            deps: ['jquery']
        },
        'jquery-tmpl': {
            deps: ['jquery']
        },
        'autoGrowInput': {
            deps: ['jquery']
        }
    }
});

require(['init']);
