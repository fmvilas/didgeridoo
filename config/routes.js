exports.routes = function (map) {
    
    // IDE
    map.get('/ide', 'ide#index');

    //Session
    map.get('/login', 'session#login');
    map.post('/login', 'session#logon');
    map.get('/logout', 'session#logout');

    // User
    map.resources('users', {path: 'u'});

    // Project
    map.resources('projects', {path: 'p'});
    map.get('/p/:id/f', 'projects#files');
    map.get('/p/:id/f/*', 'projects#fileOpen');
    map.post('/p/:id/f/*', 'projects#fileSave');

};