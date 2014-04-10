define([
    'core',
    'layout',
    'API.Action',
    'API.Event',
    'API.Shortcut',
    'API.Util',
    'API.Project',
    'API.File',
    'modules/file/file',
    'modules/project/project'
], function(core, layout) {
    
    didgeridoo.authenticityToken = $('meta[name="csrf-token"]').attr('content');

    // Constructs the Didgeridoo User Interface.
    require(['modules/main-menu/main'], function(MainMenu) {
        new MainMenu().renderTo( layout.northPanel );
    });

    didgeridoo.api.project.open('5196534c9c253bdbb1d00fb6');

    layout.getSideBar().addPanel('modules/dom-inspector/main');
    layout.getSideBar().addPanel('modules/project-explorer/main');
    didgeridoo.api.event.subscribe('didgeridoo.api.project.open', function() {
        didgeridoo.api.action.do('FileOpen', '/index.html');        
    });

    // Show confirmation before exiting
    /*window.onbeforeunload = function() {
        return "Leaving Didgeridoo this way may cause an information loss.";
    };*/

});
