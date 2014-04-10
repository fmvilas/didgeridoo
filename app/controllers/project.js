module.exports = function() {
    var routes = require('../../config/route_table'),
        pathToCDN = process.env.DOO_CONTENT;

    var _isLegalURL = function(url) {
        return !url.match(/([\.]+\/)/); // ./ and ../ are ilegal
    }

    return {
        info: function(req, res, next) {
            var Underscore = require('underscore'),
                p = req.project.toObject();

            if( p ) {
                p.id = p._id;
                delete p._id;
                
                res.json(p);
            } else {
                res.send(404);
            }
        },

        files: function(req, res, next) {
            var fs = require('fs'),
                    mime = require('mime'),
                    path,
                    query = req.query.query || {},
                    hidden = !!query.hidden || false,
                    list = query.type || 'both'; //both: List folders and files

            if( query.path ) {

                if( !_isLegalURL(query.path) ) {
                    res.send(403, {error: '../ and ./ are forbidden directories.'});
                }

                path = query.path;

                if( query.path.substr(0, 1) !== '/' ) {
                    path = '/' + query.path;
                }

                if( query.path.substr(-1) !== '/' ) {
                    path += '/';
                }
                
            } else {
                path = '/';
            }

            fs.readdir(pathToCDN + '/' + req.params.id + path, function(err, files) {
                if( err ) {
                    res.send(404, {error: err});
                } else {
                    var result = [];

                    files.forEach(function(file) {
                        var stat = fs.lstatSync(pathToCDN+'/'+req.params.id+path+file),
                            extension = stat.isFile() ? (file || '').split('.').reverse() : '',
                            isHidden = file.substr(0, 1) === '.',
                            allowedExtension = true;

                        // If file have no extension it will be treated as an empty string,
                        // otherwise it will be the extension.
                        if( extension.length <= 1 ) {
                            extension = '';
                        } else {
                            extension = extension[0].toLowerCase();
                        }

                        // Filter by extension, either including or excluding.
                        if( query.extension && Array.isArray(query.extension.list) ) {
                            var parseExtensionList = function(currentValue) {
                                return currentValue.toString().toLowerCase().trim();
                            };

                            if( query.extension.operation && query.extension.operation === 'exclude' ) {
                                allowedExtension = !(query.extension.list.map(parseExtensionList).indexOf(extension) !== -1);
                            } else {
                                allowedExtension = (query.extension.list.map(parseExtensionList).indexOf(extension) !== -1);
                            }
                        }

                        if( !(isHidden && !hidden) && allowedExtension ) {
                            if( (stat.isDirectory() && (list === 'both' || list === 'folder')) ||
                                (!stat.isDirectory() && (list === 'both' || list === 'file')) ) {

                                result = result.concat({
                                    'title': file,
                                    'key': stat.isDirectory() ? path+file+'/' : path+file,
                                    'size': stat.size,
                                    'modified': stat.mtime,
                                    'mimeType': (stat.isFile() && !isHidden) ? mime.lookup(extension) : null,
                                    'isFolder': stat.isDirectory()
                                });
                            }
                        }                    
                        
                    });
                    
                    res.json( result );
                }
            });
        },



        fileOpen: function(req, res, next) {
            var filePath = pathToCDN + '/' + req.params.id + '/' + req.params[0];

            if( _isLegalURL(filePath) ) {
                var fs = require('fs');

                fs.exists(filePath, function(exists) {
                    if( exists ) {
                        var send = require('send');

                        try {
                            send(req, filePath).hidden(true).pipe(res);
                        } catch(e) {
                            res.send(404);
                        }
                    } else {
                        res.send(404);
                    }
                });
            } else {
                res.send(403, {error: '../ and ./ are forbidden directories.'});
            }
        },



        fileSave: function(req, res, next) {
            var fs = require('fs'),
                path = req.params[0];

            
            console.dir(pathToCDN + '/' + req.params.id + '/' + path);

            fs.writeFile(pathToCDN + '/' + req.params.id + '/' + path, req.body.body, { flag: 'w+', mode: 0770 }, function(err) {
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
};