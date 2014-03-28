module.exports = function(app){

    var helpers = require('../app/controllers/helpers'),
        csrf = helpers.csrf,
        authRequired = helpers.authRequired,
        loadUser = helpers.loadUser,
        routes = require('./route_table');

    

	//ide route
	var ide = require('../app/controllers/ide');
	app.get(routes.ide, authRequired, csrf, ide.index);

    //user-related routes
    var user = require('../app/controllers/user');
    app.get(routes.user.login, csrf, user.login);
    app.post(routes.user.login, csrf, user.logon);
    app.get(routes.user.logout, csrf, user.logout);
    app.get(routes.user.show, csrf, loadUser, user.show);

    //project-related routes
    var project = require('../app/controllers/project');
    app.get(routes.project.files, csrf, project.files);
    app.get(routes.project.file, csrf, project.fileOpen);

    return routes;

};
