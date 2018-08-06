
var helper = require('../util/helper.js');
var chokidar = require('chokidar');
var libPath = require('path');




module.exports = function(options){

  var cwd = options.dir;

  var io = (require('socket.io')).listen(options.server);
  var watcher = chokidar.watch(options.file || options.dir, {
    persistent: true,
    ignored: [options.exclude,  /node_modules/ ]
  }).on('change', function( path ){


    var data = { "path": path }; 

    var extname = libPath.extname(path);
    if (extname === '.css') {
      data.css = path.slice(cwd.length);
    }

    // helper.log(path + ' is changed');

    io.emit('update', data);

  })

  return function livereload(req, res, next){
    var clientname = 'puer.client.js';
    if(res.injector) res.injector.push('<script src="/' + clientname + '"></script>')
    if(req.url === '/' + clientname ) {
      return res.sendFile( libPath.join(__dirname, '../client/bundle.js'))
    }
    next();

  }
}