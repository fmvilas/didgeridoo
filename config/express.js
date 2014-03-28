var express = require('express');

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    app.locals.errors = {};
    app.locals.message = {};
    app.locals.layout = false;
    app.locals.routes = require('./route_table');
    app.use(express.favicon(config.root + '/public/favicon.png'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser('your secret here'));
    app.use(express.methodOverride());
    app.use(express.session());
    app.use(express.csrf());
    app.use(app.router);
    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });
  });
};
