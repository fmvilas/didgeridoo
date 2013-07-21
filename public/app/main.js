require.config({
    baseUrl: '/app',
    paths: {
        //RequireJS plugins
        text: 'libs/require/plugins/text',
        //Didgeridoo modules and libs
        core: 'core/core',
        shortcut: 'modules/shortcut/shortcut',
        jquery: 'libs/jquery/jquery.min',
        'jquery-cookie': 'libs/jquery-cookie/jquery.cookie',
        dynatree: 'libs/dynatree/jquery.dynatree-1.2.4',
        underscore: 'libs/underscore/underscore-min',
        bootstrap: 'libs/bootstrap/bootstrap',
        'jquery-tmpl': 'libs/jquerytemplates/jquery.tmpl.min',
        autoGrowInput: 'libs/autoGrowInput/autoGrowInput',
        codemirror_script: 'libs/codemirror/lib/codemirror'
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
