load('application');
before(use('authRequired'), {only: 'logout'});

action('login', function() {
    if( !req.session.user ) {
        layout(false);
        this.title = 'Login';
        this.user = new User;

        render();
    } else {
        redirect( path_to.ide );
    }
});

action('logon', function() {
    var params = req.body;

    this.user = new User;

    User.all({where: {email: params.email}}, function(err, result) {
        if( result !== null &&
            result.length > 0 &&
            params.email === result[0].email &&
            params.password === result[0].password ) {
                req.session.user = params.email;
                redirect( params.redirect );
        } else {
            send(500);
        } 
    });
});

action('logout', function() {
    req.session.user = null;
    redirect( path_to.login );
});