module.exports = function (compound) {

    var express = require('express');
    var app = compound.app;

    app.configure(function(){
        app.use(express.static(app.root + '/public', { maxAge: 86400000 }));
        app.set('jsDirectory', '/js/');
        app.set('cssDirectory', '/css/');
        app.set('cssEngine', 'stylus');
        app.use(express.bodyParser());
        app.use(express.cookieParser('secret'));
        app.use(express.session({secret: 'secret'}));
        app.use(express.methodOverride());
        app.use(app.router);
    });

    express.static.mime.define({'application/font-woff': ['woff']});

};
