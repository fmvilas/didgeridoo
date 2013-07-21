load('application');

var app = this;

before(use('authRequired'));

before(loadProject, {
    only: ['show', 'edit', 'update', 'destroy', 'files']
});



action('new', function () {
    this.title = 'New project';
    this.project = new Project;
    render();
});

action(function create() {
    Project.create(req.body.Project, function (err, project) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: project && project.errors || err});
                } else {
                    send({code: 200, data: project.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Project can not be created');
                    render('new', {
                        project: project,
                        title: 'New project'
                    });
                } else {
                    flash('info', 'Project created');
                    redirect(path_to.projects);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Projects index';
    Project.all(function (err, projects) {
        switch (params.format) {
            case "json":
                send({code: 200, data: projects});
                break;
            default:
                render({
                    projects: projects
                });
        }
    });
});

action(function show() {
    this.title = 'Project show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.project});
            break;
        default:
            render();
    }
});

action(function files() {
    var project = this.project;

    //if( params.format === 'json' ) {
        var fs = require('fs'),
            mime = require('mime'),
            path
            list = req.query.list || 'both'; //List folders and files

        console.dir(list);

        if( req.query.directory ) {

            if( req.query.directory.match(/^[\.]+\//) ) { // Forbidden ../ and ./
                send({code: 500, error: '../ and ./ are forbidden directories.'})
            }

            if( req.query.directory.substr(0, 1) === '/' ) {
                path = req.query.directory + (req.query.directory.substr(0, 1) !== '/' ? '/' : '')
                        + (req.query.directory.slice(-1) !== '/' ? '/' : '');
            } else {
                path = '/' + req.query.directory;
            }
            
        } else {
            path = '/';
        }

        fs.readdir(pathToCDN + '/' + params.id + path, function(err, files) {
            if( err ) {
                send({code: 500, error: err});
            } else {
                var result = [];

                files.forEach(function(file) {
                    var stat = fs.lstatSync(pathToCDN+'/'+params.id+path+file),
                        extension = stat.isFile() ? (file || '').split('.').reverse() : '',
                        isHidden = file.substr(0, 1) === '.';

                    if( extension.length <= 1 ) {
                        extension = '';
                    } else {
                        extension = extension[0];
                    }

                    if( (stat.isDirectory() && (list === 'both' || list === 'folders')) ||
                        (!stat.isDirectory() && (list === 'both' || list === 'files')) ) {

                        result = result.concat({
                            'title': file,
                            'key': stat.isDirectory() ? path+file+'/' : path+file,
                            'size': stat.size,
                            'modified': stat.mtime,
                            'mimeType': (stat.isFile() && !isHidden) ? mime.lookup(extension) : null,
                            'isFolder': stat.isDirectory(),
                            'isLazy': stat.isDirectory(),
                            'addClass': (isHidden ? 'hidden-file' : '') + ( (stat.isFile() && !isHidden) ? ' ' + extension.toLowerCase() : '')
                        });

                    }
                    
                });
                
                if( path === '/' && (list === 'both' || list === 'folders') ) {
                    result = [{
                        'title': project.name,
                        'key': '/',
                        'size': 0,
                        'modified': null,
                        'expand': true,
                        'isFolder': true,
                        'isLazy': true,
                        'children': result
                    }];
                }
                
                send( result );
            }
        });
    /*} else {
        send(500);
    }*/
});

action(function fileOpen() {
    var mime = require('mime');

    console.dir( mime.lookup( params[0].split('.').slice(-1)[0] ) );
    res.sendfile(pathToCDN + '/' + params.id + '/' + params[0]);
});

action(function fileSave() {
    var fs = require('fs'),
        path = params[0];

    console.dir(app.pathToCDN + '/' + params.id + '/' + path);

    fs.writeFile(app.pathToCDN + '/' + params.id + '/' + path, req.body.body, { flag: 'w+', mode: 0770 }, function(err) {
        if(err) {
            console.dir(err);
            send(500, err);
        } else {
            console.log('File ' + path + ' Saved!');
            send(200);
        }
    });
});

action(function edit() {
    this.title = 'Project edit';
    switch(params.format) {
        case "json":
            send(this.project);
            break;
        default:
            render();
    }
});

action(function update() {
    var project = this.project;
    this.title = 'Edit project details';
    this.project.updateAttributes(body.Project, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: project && project.errors || err});
                } else {
                    send({code: 200, data: project});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Project updated');
                    redirect(path_to.project(project));
                } else {
                    flash('error', 'Project can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.project.destroy(function (error) {
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
                    flash('error', 'Can not destroy project');
                } else {
                    flash('info', 'Project successfully removed');
                }
                send("'" + path_to.projects + "'");
            });
        });
    });
});

function loadProject() {
    Project.find(params.id, function (err, project) {
        if (err || !project) {
            if (!err && !project && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.projects);
        } else {
            this.project = project;
            next();
        }
    }.bind(this));
}
