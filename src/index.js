// var express.static = require("serve-static");
var injector = require('./middleware/injector.js');
var rewrite = require('./middleware/rewrite.js');
var folder = require('./middleware/folder.js');
var helper = require('./util/helper.js');
var velocity = require('./render/velocity.js');
var chokidar = require('chokidar');
var socket = require('socket.io');
var express = require('express');
var morgan = require('morgan')
var path = require('path');
var http = require('http');
var chalk = require('chalk')

var setting = require('./util/setting.js');

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

  app.use(function( req, res, next ){
    helper.log( req.url )
    next();
  })

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

  for(var i in engine) if (engine.hasOwnProperty(i)){
    app.engine(i, engine[i])
  }

  // app.use( morgan("puer") );
  app.use( 
    injector({
      replacement: '<script src="/puer-resources/reload.js"></script>'
    }) 
  );

  if(options.rules){ app.use( rewrite(options)); }
  app.use( folder(options) );
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

puer({
  dir: process.cwd(),
  port: 8001,
  views: "test/public/view",
  rules: './test/mock_*.js'
  // rules: {
  //   "GET /post/:id": {
  //     code: 1,
  //     result: 1
  //   },
  //   "GET /homepage": function(req, res, next){
  //     res.render("index.vm", {})
  //   },
  //   "GET /api/(.*)": "http://localhost:8001/${0}"

  // }

});

var notifier = require('node-notifier');

notifier.notify({
  title: 'refreshed!',
  message: 'nodeman is refreshing!!',
  // icon: path.join(__dirname, 'coulson.jpg'), // absolute path (not balloons)
  // sound: true, // Only Notification Center or Windows Toasters
  wait: true // wait with callback until user action is taken on notification
}, function (err, response) {
  // response is response from notification
});







