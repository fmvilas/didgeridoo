var routes = require('../../config/route_table');

module.exports = {

    login: function(req, res, next) {
        if( !req.session.user ) {
            res.render('users/login', {
                title: 'Login'
            });
        } else {
            res.redirect( routes.ide );
        }
    },

    logon: function(req, res, next) {
        var User = require('../models/user'),
            params = req.body;

        User.findOne({ email: params.email }, function(err, user) {
            if (err) throw err;
         
            // test if password matches
            user.comparePassword(params.password, function(err, isMatch) {
                if (err) throw err;

                if( isMatch ) {
                    console.log('\n\nPassword matches!\n\n');
                    req.session.user = user;
                    res.redirect( params.redirect || '/' );
                } else {
                    res.send('Password incorrect');
                }
            });
        });
    },

    signup: function(req, res, next) {
        var User = require('../models/user');

        var user = new User({
            email: 'demo@didgeridoo.io',
            password: '1234',
            name: 'Demo',
            avatarURL: 'http://www.gravatar.com/avatar/f3bad9b06a1b0512c5c837f28dddd985.png'
        });

        user.save(function() {
            console.log('saved!');
            req.session.user = user;
            res.redirect( params.redirect || '/' );
        });
    },

    logout: function(req, res, next) {
        req.session.user = null;
        res.redirect( routes.login );
    },

    show: function(req, res, next) {
        var u = req.session.user;

        if( u ) {
            res.json({
                id: u.id,
                email: u.email,
                name: u.name || '',
                githubLogin: u.githubLogin || false,
                avatarURL: u.avatarURL || '',
                preferences: u.preferences || {},
                //projects: apiUserProjects()
            });
        } else {
            res.redirect( routes.user.login );
        }
    },

    projects: function(req, res, next) {
        res.send(apiUserProjects());
    },

    create: function(req, res, next) {
        createUser(req.query, function(err, user) {
            if( err ) {
                res.send(500);
            } else {
                console.log("User created:");
                console.dir(user);
                next();
            }
        });
    }

};

/*function apiUser() {
    var u = req.session.user;

    return {
        id: u.id,
        email: u.email,
        name: u.name || '',
        githubLogin: u.githubLogin || false,
        avatarURL: u.avatarURL || '',
        preferences: u.preferences || {},
        projects: apiUserProjects()
    };
};

function apiUserProjects() {
    var u = req.session.user;

    Project.find({where: {owner: u.id}}, function (err, projects) {
        if (err) {
            return null;
        } else {
            return projects;
        }
    });
};

function createUser(info, cb) {
    console.dir(info);
    User.create(info, function(err, user) {

        cb.apply(this, [err, user]);
    });
}*/