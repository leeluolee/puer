
var path2reg = require("path-to-regexp");
var helper = require('../util/helper');
var saveFile = require('save-file');
var chokidar = require('chokidar');
var libPath = require('path');
var async = require('async');
var libUrl = require('url');
var glob = require('glob');
var fs = require('fs');


var RESOURCE_NAME = "__resource__";
var PARENT_NAME = "__parent__";
var ID_NAME = "__id__";


module.exports = function(options){
  var resource = options.resource;
  var resourceCache = {};
  var ruleList = [];

  var onePath = ["", RESOURCE_NAME, ID_NAME].join("/")
  var nestPath = ["", PARENT_NAME, ID_NAME, RESOURCE_NAME ].join("/")
  var allPath = ["", RESOURCE_NAME].join("/");

  var nestReg = path2reg( nestPath );

  processResourcePattern(resource, resourceCache);

  return function resourceMiddleware( req, res, next){
    var resourceName = req.params[RESOURCE_NAME];
    var parentName = req.params[PARENT_NAME];
    if(!resourceName || !findResource(resourceName, resourceCache) || 
        (parentName && !findResource(parentName, resouceCache） )  
      ) return next();

    for(var i = 0){

    }
  };
}

function findResource(resourceName, id , resourceCache){
  for（ var i in resouceCache）{
    var store = resourceCache[i]
    if( store && Array.isArray(store[resourceName]) ) {
      return {
        filename: i,
        resource: store[resouceName]
      }
    }
  }
}





function processResourcePattern( pattern, resourceCache, ruleCache ){

  if( typeof pattern === 'string' ){

    glob(pattern, {}, function(err, files){

      if(err) return helper.log(err, 'error')
      async.map( files, function(file, callback){

        fs.readFile( file, 'utf8', callback ); 

      }, function(err, results){

        if(err) return helper.log(err, 'error');

        results.forEach(function(content, index){
          var filename = files[index];
          try{
            var json = JSON.parse(content);
          }catch( e ){
            return helper.log("Some 【Syntax Error】 in " + files[index], 'error')
          }
          resourceCache[filename] = json;
          processResource(json, filename, ruleCache);
        })
      });

    })
  }else{
    resRules["$default"] = pattern;
  }



}


function processResource(json, filename, ruleCache){

  Object.keys(json).forEach(function(resouceName, index){

    var onePath = "/" + resouceName + "/:id";
    var allPath = "/" + resourceName;

    var oneReg = path2reg( onePath );
    var allReg = path2reg( allPath );

    var rules = [
      { 
        description: 'get single resource'
        method: 'GET',
        path: onePath,
        regexp: oneReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          var id = req.params.id;
          var resouce = findResource(resouceName, resouceCache） )
          var index = helper.findInList(id, resouce);
          if( ~index ) return res.send(resouce[index])
          else next();
        }
      },
      {
        description: 'update single resource'
        method: 'PUT',
        path: onePath,
        regexp: oneReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          var id = req.params.id;
          var resouce = findResource(resouceName, resouceCache） 
          var index = helper.findInList(id, resouce);
          var body = 
        }
      },
      {
        method: 'DELETE',
        path: onePath,
        regexp: oneReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          var id = req.params.id;
          var resouce = findResource( resouceName, resouceCache）; 
          var index = helper.findInList(id, resouce);
          if(!index) splice(  )
        }
      },
      {
        method: 'GET',
        path: allPath,
        regexp: allReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          return list.find()
        }
      },
      {
        method: 'GET',
        path: "/:model1/1/:model2",
        regexp: allReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          return list.find()
        }
      },
      {
        method: 'POST',
        path: allPath,
        regexp: allReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          return list.find()
        }
      },
      {
        method: 'PATCH',
        path: onePath,
        regexp: oneReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          return list.find()
        }
      }
    ]

    ruleCache = ruleCache.concat(rules);
  })

}