require.config({
    baseUrl: '/app',
    paths: {
        //RequireJS plugins
        text: 'libraries/require/plugins/text',
        //Didgeridoo modules and libraries
        core: 'core/didgeridoo',
        actions: 'modules/action/actions',
        shortcut: 'modules/shortcut/shortcut',
        jquery: 'libraries/jquery/jquery.min',
        'jquery-cookie': 'libraries/jquery-cookie/jquery.cookie',
        dynatree: 'libraries/dynatree/jquery.dynatree-1.2.4',
        underscore: 'libraries/underscore/underscore-min',
        bootstrap: 'libraries/bootstrap/bootstrap',
        'jquery-tmpl': 'libraries/jquerytemplates/jquery.tmpl.min',
        autoGrowInput: 'libraries/autoGrowInput/autoGrowInput',
        moment: 'libraries/moment/moment.min',
        codemirror_script: 'libraries/codemirror/lib/codemirror'
    },
    shim: {
        'core': {
            deps: ['jquery', 'jquery-tmpl', 'jquery-cookie', 'bootstrap']
        },
        'actions': {
            deps: ['core']
        },
        'shortcut': {
            deps: ['core']
        },
        'libraries/codemirror/codemirror': {
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
