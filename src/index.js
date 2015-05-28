// var express.static = require("serve-static");
var livereload = require('./middleware/livereload.js');
var injector = require('./middleware/injector.js');
var rewrite = require('./middleware/rewrite.js');
var folder = require('./middleware/folder.js');
var helper = require('./util/helper.js');
var velocity = require('express-velocity');
var chokidar = require('chokidar');
var socket = require('socket.io');
var express = require('express');
var morgan = require('morgan')
var path = require('path');
var http = require('http');
var chalk = require('chalk')


/**
 * [PuerServer description]
 * @param {[type]} options [description]
 *    - port: static server's port
 *    - proxy: proxy server
 *    - mock:  mockfile
 *    - weinre:  {port: 1}
 *    - render: { extName: ".ftl", compile: function(str){} }
 */

// puer --ban=reload,launch,


var puer = module.exports = function ( options ){
  options = options || {}
  var app = express();
  var server = http.createServer( app );


  helper.extend(options, {
    views: 'views',
    engine: { },
    port: 8000,
    app: app,
    dir: process.cwd()
  })
  var base = options.config? path.resolve( options.dir , path.dirname(options.config)): options.dir;

  options.views = path.resolve(base, options.views);

  if( typeof options.rules === 'string') {
    options.rules = path.resolve( options.dir, options.rules )
  } 

  app.set('views', options.views);
  
  // engine
  var engine = options.engine;
  engine.vm = velocity({root: [options.views]});

  console.log(engine)
  for(var i in engine) if (engine.hasOwnProperty(i)){
    app.engine(i, engine[i])
  }

  app.use( 
    injector(options) 
  );

  if(options.reload){
    options.server = server;
    app.use( livereload (options))
  }
  

  if(options.rules){ app.use( rewrite( options ) ); }
  app.use( folder( options ) );
  app.use( express.static( options.dir )  );

  server.on('error', function (e) {
    // if listen port is in using
    if (e.code == 'EADDRINUSE') {
      // server.close();
      helper.log('port ' + chalk.bold(options.port)+ ' is in use, retrying port ... ' + chalk.bold("" + (++options.port) ), 'warn');
      setTimeout( start, 1000);
    }else{
      helper.log(e.message, 'error');
      throw e;
    }
  });
  server.on('listening', function(){
    var url = 'http://localhost:' + options.port;
    helper.log("puer successfully started at " + chalk.underline.bold( url ), 'success')
    if(options.launch) helper.openBrowser( url );
  })

  var tries = 1;
  function start(){
    if(tries++ >= 10 ) {
      helper.log("Too many attempts, please try other ports", 'error') 
      return process.exit(0);
    }
    server.listen( options.port );
  }

  start();

}

