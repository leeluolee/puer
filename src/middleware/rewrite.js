var setting = require('../util/setting.js');
var path2reg = require("path-to-regexp");
var proxy = require('../util/proxy.js');
var notifier = require('node-notifier');
var helper = require('../util/helper');
var chokidar = require('chokidar');
var chalk = require('chalk');
var libPath = require('path');
var libUrl = require('url');
var fs = require('fs');




function processHandle(handle, options){
  var type = typeof handle;

  if(type === 'string' ){ // proxy or file send

    if( handle.indexOf('http') === 0 ) { // http or https
      return function( req, res ){
        var uObj = libUrl.parse(req.url);
        uObj.pathname = "/";
        var relUrl = helper.encode(handle, req.params);
        if(relUrl !== handle){
          req.url = libUrl.format(uObj);
          handle = relUrl;
        }
        return proxy( req, res, handle) 
      }
    }
    // var filepath = libPath.resolve( process.cwd(), handle );
    // if( fs.existsSync( filepath ) ){
    return function( req, res, next){
      var relativePath =  helper.encode( handle, req.params)
      if( fs.existsSync( filepath ) ){
        return res.sendFile( libPath.resolve(process.cwd(), relativePath ) )
      }else{
        res.send(handle)
      }
    }
  }
  if(type !== 'function' ){
    return function(req, res){
      res.send(handle)
    }
  }

  return handle;
}

function rewriteMiddleware( options ){
  var ruleCache = {defaults: []}



  function processRules(rules){
    var rst = []
    for(var i in rules) if ( rules.hasOwnProperty(i) ){
      rst.push(createRule(i, rules[i]) )
    }
    console.log(rst)
    return rst;
  }

  function createRule( path, handle){
    var tmp = path.split(/\s+/), method = "all";
    if( tmp[0] && tmp[1] ) {
      method = tmp[0].toLowerCase();
      path = tmp[1];
    }
    var regexp = path2reg( path );
    return {
      method: method,
      path: path,
      regexp: regexp,
      keys: regexp.keys,
      handle: handle
    } 
  }


  // reset(options.rules);

  var definition;
  if( typeof options.rules === 'string' ){
    chokidar.watch(options.rules).on('all', function( event, path ){
      var logPath = chalk.underline.italic( path );
      switch(event){
        case 'add':
        case 'change':
          try{
            if( libPath.extname(path) === '.js'){
              delete require.cache[path];
              ruleCache[path] = processRules(require(path));
            }
            helper.log( 'rule ' + logPath + ' update');
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
    ruleCache['defaults'] = processRules( options.rules );
  }

  return function rule( req, res, next ){
    var url = libUrl.parse(req.url);
    var method = req.method.toLowerCase();
    console.log(ruleCache)

    for(var i in ruleCache){
      var rules = ruleCache[i]
      for(var i = 0, len = rules.length; i < len; i++ ){

        var rule = rules[i];

        if((rule.method === 'all' || rule.method === method) && 
            rule.regexp ){

          var params = helper.getParam( rule.regexp ,url.pathname);

          if(params && rule.handle) {

            req.params = params;
            return rule.handle(req, res, next);
          }

        }
      }
    }
    next();
  }
}





module.exports = rewriteMiddleware;