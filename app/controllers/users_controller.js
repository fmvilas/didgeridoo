load('application');
before(use('authRequired'), {except: ['new', 'create']});

before(loadUser, {
    only: ['show', 'edit', 'update', 'destroy']
});

action('new', function () {
    this.title = 'New user';
    this.user = new User;
    render();
});

action('create', function () {
    User.create(req.body.User, function (err, user) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: user && user.errors || err});
                } else {
                    send({code: 200, data: user.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'User can not be created');
                    render('new', {
                        user: user,
                        title: 'New user'
                    });
                } else {
                    flash('info', 'User created');
                    redirect(path_to.users);
                }
            });
        });
    });
});

action('show', function () {
    this.title = 'User show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.user});
            break;
        default:
            render();
    }
});

action('edit', function () {
    this.title = 'User edit';
    switch(params.format) {
        case "json":
            send(this.user);
            break;
        default:
            render();
    }
});

action('update', function () {
    var user = this.user;
    this.title = 'Edit user details';
    this.user.updateAttributes(body.User, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: user && user.errors || err});
                } else {
                    send({code: 200, data: user});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'User updated');
                    redirect(path_to.user(user));
                } else {
                    flash('error', 'User can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action('destroy', function () {
    this.user.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy user');
                } else {
                    flash('info', 'User successfully removed');
                }
                send("'" + path_to.users + "'");
            });
        });
    });
});

function loadUser() {
    User.find(params.id, function (err, user) {
        if (err || !user) {
            if (!err && !user && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.u);
        } else {
            this.user = user;
            next();
        }
    }.bind(this));
}
