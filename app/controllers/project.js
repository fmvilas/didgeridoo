var routes = require('../../config/route_table');

module.exports = {
    files: function(req, res, next) {
        var fs = require('fs'),
                mime = require('mime'),
                path,
                list = req.query.list || 'both', //both: List folders and files
                project = this.project;

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

        fs.readdir(pathToCDN + '/' + req.params.id + path, function(err, files) {
            if( err ) {
                res.send({code: 500, error: err});
            } else {
                var result = [];

                files.forEach(function(file) {
                    var stat = fs.lstatSync(pathToCDN+'/'+req.params.id+path+file),
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
                
                res.send( result );
            }
        });
    },



    fileOpen: function(req, res, next) {
        res.sendfile(app.pathToCDN + '/' + req.params.id + '/' + req.params[0]);
    },



    fileSave: function(req, res, next) {
        var fs = require('fs'),
            path = req.params[0];

        console.dir(app.pathToCDN + '/' + req.params.id + '/' + path);

        fs.writeFile(app.pathToCDN + '/' + req.params.id + '/' + path, req.body.body, { flag: 'w+', mode: 0770 }, function(err) {
            if(err) {
                console.dir(err);
                res.send(500, err);
            } else {
                console.log('File ' + path + ' Saved!');
                res.send(200);
            }
        });
    }
};

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

function apiProject(p) {
    var creationDate = new Date(parseInt(p.id.toString().slice(0,8), 16)*1000);

    return {
        id: p.id,
        name: p.name || 'untitled',
        owner: p.owner,
        creationDate: creationDate,
        lastModificationDate: p.lastModificationDate || creationDate,
        team: p.team || [],
        repoURL: p.repoURL || null
    };
}