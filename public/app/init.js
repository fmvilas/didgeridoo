define([
    'core',
    'actions',
    'shortcut',
    'codemirror_script'
], function(core) {

    didgeridoo.currentProject = '5196534c9c253bdbb1d00fb6';
    didgeridoo.authenticityToken = $('meta[name="csrf-token"]').attr('content');

    // Load dialog modules

    require(['modules/ui/dialog/dialogs']);

    // Constructs the Didgeridoo User Interface.
    require(['modules/ui/layout/layout'], function(layout) {

        require(['modules/ui/main-menu/main'], function(MainMenu) {
            new MainMenu().renderTo( layout.getNorthPanel() );
        });

        layout.getSideBar().addPanel('modules/ui/dom-inspector/main');
        layout.getSideBar().addPanel('modules/ui/project-explorer/main');

        didgeridoo.Action.do('FileOpen', '/index.html');
    });

    window.onbeforeunload = function() {
        return "Leaving Didgeridoo this way may cause an information loss.";
    };

});
