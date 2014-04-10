require.config({
    baseUrl: '/app',
    paths: {
        //RequireJS plugins
        text: 'components/requirejs-text/text',
        //Didgeridoo modules and libs
        core: 'core/core',

        'API.Action': 'api/action/action',
        'API.Event': 'api/event/event',
        'API.File': 'api/file/file',
        'API.Project': 'api/project/project',
        'API.Shortcut': 'api/shortcut/shortcut',
        'API.Util': 'api/util/util',
        'API.User': 'api/user/user',

        autogrow: 'libs/autoGrowInput/autoGrowInput',
        codemirror: 'libs/codemirror/codemirror',
        codemirror_script: 'components/codemirror/lib/codemirror',
        dynatree: 'components/dynatree/dist/jquery.dynatree.min',
        jquery: 'components/jquery/dist/jquery.min',
        'jquery.ui.core': 'components/jquery.ui/ui/jquery.ui.core',
        'jquery.ui.mouse': 'components/jquery.ui/ui/jquery.ui.mouse',
        'jquery.ui.position': 'components/jquery.ui/ui/jquery.ui.position',
        'jquery.ui.resizable': 'components/jquery.ui/ui/jquery.ui.resizable',
        'jquery.ui.selectable': 'components/jquery.ui/ui/jquery.ui.selectable',
        'jquery.ui.sortable': 'components/jquery.ui/ui/jquery.ui.sortable',
        'jquery.ui.widget': 'components/jquery.ui/ui/jquery.ui.widget',
        'largeLocalStorage': 'components/lls/dist/LargeLocalStorage',
        Q: 'components/q/q',
        underscore: 'components/underscore/underscore',
        
        layout: 'modules/layout/layout',
        tabs: 'modules/tabs/tabs',
        tab: 'modules/tabs/tab'
    },
    shim: {
        autogrow: {
            deps: ['jquery'],
            exports: '$.fn.autoGrowInput'
        },
        codemirror: {
            deps: ['codemirror_script'],
            exports: 'CodeMirror'
        },
        core: {
            deps: ['jquery'],
            exports: 'didgeridoo'
        },
        dynatree: {
            deps: ['jquery'],
            exports: '$.fn.dynatree'
        },
        jquery: {
            exports: '$'
        },
        'jquery.ui.core': {
            exports: '$.ui'
        },
        'jquery.ui.mouse': {
            deps: [ 'jquery.ui.core',
                    'jquery.ui.widget'],
            exports: '$.ui.mouse'
        },
        'jquery.ui.position': {
            deps: [ 'jquery.ui.core',
                    'jquery.ui.mouse',
                    'jquery.ui.widget'],
            exports: '$.ui.position'
        },
        'jquery.ui.resizable': {
            deps: [ 'jquery.ui.core',
                    'jquery.ui.mouse',
                    'jquery.ui.widget'],
            exports: '$.ui.resizable'
        },
        'jquery.ui.selectable': {
            deps: [ 'jquery.ui.core',
                    'jquery.ui.mouse',
                    'jquery.ui.widget'],
            exports: '$.ui.selectable'
        },
        'jquery.ui.sortable': {
            deps: [ 'jquery.ui.core',
                    'jquery.ui.mouse',
                    'jquery.ui.widget'],
            exports: '$.ui.sortable'
        },
        'jquery.ui.widget': {
            deps: [ 'jquery.ui.core'],
            exports: '$.ui.widget'
        }
    }
});

require(['init']);

