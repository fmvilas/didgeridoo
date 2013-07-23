define([
    'core',
    'layout',
    'action',
    'event',
    'shortcut',
    'util/system',
    'modules/file/file'
], function(core, layout) {

    didgeridoo.currentProject = '5196534c9c253bdbb1d00fb6';
    didgeridoo.authenticityToken = $('meta[name="csrf-token"]').attr('content');

    // Constructs the Didgeridoo User Interface.
    require(['modules/main-menu/main'], function(MainMenu) {
        new MainMenu().renderTo( layout.getNorthPanel() );
    });

    layout.getSideBar().addPanel('modules/dom-inspector/main');
    layout.getSideBar().addPanel('modules/project-explorer/main');

    didgeridoo.api.action.do('FileOpen', '/index.html');

    // Show confirmation before exiting
    window.onbeforeunload = function() {
        return "Leaving Didgeridoo this way may cause an information loss.";
    };

});
