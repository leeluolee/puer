// var express.static = require("serve-static");
var livereload = require('./middleware/livereload.js');
var injector = require('./middleware/injector.js');
var rewrite = require('./middleware/rewrite.js');
var folder = require('./middleware/folder.js');
var velocity = require('express-velocity');
var helper = require('./util/helper.js');
var bodyParser = require('body-parser');
var chokidar = require('chokidar');
var weinre = require('weinre');
var socket = require('socket.io');
var express = require('express');
var path = require('path');
var http = require('http');
var chalk = require('chalk')

var puer = require('./puer');



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
    dir: process.cwd(),
    injector: []
  })

  var base = options.config? path.resolve( options.dir , path.dirname(options.config)): options.dir;

  options.views = path.resolve(base, options.views);

  if( typeof options.rules === 'string') {
    options.rules = path.resolve( options.rules )
  } 


  app.set('views', options.views);
  
  // engine
  var engine = options.engine;
  engine.vm = velocity({root: [options.views]});

  for(var i in engine) if (engine.hasOwnProperty(i)){
    app.engine(i, engine[i])
  }

  app.use( injector(options) );

  // app.use( bodyParser.json() );
  // app.use( bodyParser.urlencoded({ extended: false }))

  if(options.inspect === true) options.inspect = 9000;
  var inspect = options.inspect;
  if( inspect ){

    app.use(function(req, res, next){
      res.injector.push('<script type="text/javascript" src="http://' + 
          req.get('host').replace(/:\d+/,'') + ':' + 
          inspect + '/target/target-script-min.js#anonymous"></script>');
      next();
    })

    // Thx for browsyer-sync for solving the headache with weinre
    // https://github.com/BrowserSync/UI/blob/baa9407ee2ace8dd575dc464c46e6d6ab547219e/lib/plugins/remote-debug/weinre.js#L166
    var logger   = require(path.resolve(__dirname, "../node_modules/weinre/lib/utils.js"));

    logger.log = function (message) {
        helper.log( "【weinre】-" + message);
    };

    weinre.run({
      httpPort:  inspect,
      boundHost: '-all-',
      verbose: false,
      debug: false,
      readTimeout: 20,
      deathTimeout: 50
    });
  }

  if(options.reload){
    options.server = server;
    app.use( livereload (options))
  }
  

  if(options.rules){ app.use( rewrite( options ) ); }
  app.use( folder( options ) );
  app.use( express.static( options.dir )  );
  app.use(function(err, req, res, next) {
    helper.log(err.message || err, 'error');
    res.status(500).send('Something is broken!');
  });
  server.on('error', function (e) {
    // if listen port is in using
    if (e.code == 'EADDRINUSE') {
      // server.close();
      helper.log('port ' + chalk.bold(options.port)+ ' is in use, retrying port ... ' + chalk.bold("" + (++options.port) ), 'warn');
      setTimeout( start, 1000);
    }else{
      helper.log(e.message, 'error');
    }
  });




  server.on('listening', function(){
    var url = 'http://localhost:' + options.port;
    helper.log("puer successfully started at " + chalk.underline.magenta.bold( url ), 'success')
    if(options.launch) helper.openBrowser( url );
  })


  var tries = 1;
  function start(){
    if( tries++ >= 10 ) {
      helper.log("Too many attempts, please try other ports", 'error') 
      return process.exit( 0 );
    }
    server.listen( options.port );
  }

  start();

}

