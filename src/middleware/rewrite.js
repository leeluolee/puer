
var path2reg = require("path-to-regexp");
var proxy = require('../util/proxy.js');
var jsonParser = require('body-parser').json();
var urlencoded = require('body-parser').urlencoded({ extended: false });
var notifier = require('node-notifier');
var helper = require('../util/helper');
var chokidar = require('chokidar');
var request = require('request');
var libPath = require('path');
var chalk = require('chalk');
var async = require('async');
var libUrl = require('url');
var glob = require('glob');
var fs = require('fs');


function processHandle( handle, rulePath ){
  var type = typeof handle;
  var ruleDir;

  if(typeof rulePath === 'string'){
    ruleDir = libPath.dirname( rulePath );
  }else{
    ruleDir = process.cwd();
  }

  if(type === 'string' ){ // proxy or file send

    if( handle.indexOf('http') === 0 ) { // http or https
      return function( req, res ){
        // todo
        var relUrl = helper.encode( handle, req.params );

        // var target = relUrl !== handle? relUrl:  libUrl.resolve(relUrl, req.url);
        // var stream = request({
        //   uri: target,
        //   method: req.method
        // }, function (error, response, body) {
        //   if (error) {
        //     return console.error('upload failed:', error);
        //   }

        // });
        // stream.pipe(res);
        // req.pipe(stream);

        // fix target path
        if(relUrl !== handle){
          req.url = libUrl.parse(relUrl).path;
        }


        return proxy( req, res, {
          target: relUrl
        }) 
      }
    }
    return function( req, res, next){
      var relativePath =  helper.encode( handle, req.params)
      var filepath = libPath.resolve( ruleDir, relativePath );
      if( fs.existsSync( filepath  ) ){
        return res.sendFile( filepath );
      }else{
        res.send(handle)
      }
    }
  }

  // {
  //  handle: 'xx',
  //  transform: xx
  // }
  if( helper.typeOf(handle) === 'object' ){
    var realHandle = processHandle(handle.handle, rulePath);
    return function(req, res, next){
      res.puer_transform = handle.transform
      realHandle(req, res, next);
    }
  }

  if(typeof handle !== 'function'){
    return function(req, res){
      res.send(handle)
    }
  }

  return function(req, res, next){
    // https://github.com/nodejitsu/node-http-proxy/issues/180#issuecomment-97702206
    // Fix body Parser error
    jsonParser(req, res, function(){
      urlencoded(req, res, function(){
        handle(req, res, next)
      })
    });
  }
}
function processRule(rules, rulePath){
  var rst = []
  for(var i in rules) if ( rules.hasOwnProperty(i) ){
    rst.push(createRule(i, rules[i], rulePath) )
  }
  return rst  ;
}
function createRule( path, handle, rulePath){
  var tmp = path.split(/\s+/), method = "all";
  if( tmp[0] && tmp[1] ) {
    method = tmp[0].toLowerCase();
    path = tmp[1];
  }
  var regexp = path2reg( path );
  handle = processHandle(handle, rulePath)
  return {
    method: method,
    path: path,
    regexp: regexp,
    keys: regexp.keys,
    handle: handle
  } 
}

function rewriteMiddleware( options ){


  var ruleCache = {defaults: []};

  processRules( options.rules, ruleCache );


  return function rule( req, res, next ){

    var url = libUrl.parse( req.url );
    var method = req.method.toLowerCase();
    var applied = [];

    // checking ruleCache
    for(var i in ruleCache){
      var rules = ruleCache[i];
      for(var i = 0, len = rules.length; i < len; i++ ){

        var rule = rules[i];

        if((rule.method === 'all' || rule.method === method) && rule.regexp ){

          var params = helper.getParam( rule.regexp ,url.pathname);

          if(params && rule.handle) {

            applied.push({
              params: params,
              handle: rule.handle,
              path: rule.path
            })
          }

        }
      }
    }

    var alen = applied.length;
    if( !alen ) return next();

    var cursor = -1;
    function nextStep(){
      cursor++ 
      if(cursor === alen) return next();
      var step = applied[cursor];
      req.params = step.params;
      try{
        step.handle(req, res, nextStep)
      }catch(e){
        notifier.notify({
          title: 'some error occurs in route: ' + step.path,
          message: e.message
        })
        helper.log( 'some error occurs in route: ' + step.path + '\n' + e.message, 'error') 
        next()
      }
    }
    nextStep();
  }
}

function processRules(rules, ruleCache){

  if( typeof rules === 'string' ){
    chokidar.watch(rules).on('all', function( event, path ){
      var logPath = chalk.underline.italic( path );
      switch(event){
        case 'add':
        case 'change':
          try{
            if( libPath.extname(path) === '.js'){
              delete require.cache[path];
              ruleCache[path] = processRule(require(path), path);
            }
            helper.log( 'rule ' + logPath + ' synchronized');
          }catch(e){ 
            notifier.notify({
              title: 'some error occurs in ' + path,
              message: e.message
            })
            helper.log( logPath + '\n\t' + e.message, 'error') 
          }
          break;
        case 'unlink':
          delete ruleCache[path]
          break;
        case 'error':
          helper.log('Some Error happend:' + path, 'error');
      }
    })
  }else{
    ruleCache['$defaults'] = processRules( options.rules, options.dir );
  }
}


module.exports = rewriteMiddleware;