
var path2reg = require("path-to-regexp");
var helper = require('../util/helper');
var chokidar = require('chokidar');
var fstorm = require('fstorm');
var libPath = require('path');
var async = require('async');
var libUrl = require('url');
var glob = require('glob');
var express = require('express');
var fs = require('fs');

var RESOURCE_NAME = "__resource__" ;
var PARENT_NAME = "__parent__" ;
var ID_NAME = "__id__" ;


module.exports = function(options){

  processResourcePattern(resource, resourceCache);

  function resourceMiddleware( req, res, next){

    var resourceName = req.params[RESOURCE_NAME];
    var parentName = req.params[PARENT_NAME];
    var resobj, parentObj;

    if( !resourceName || !( resobj = findResource(resourceName, resourceCache) ) || 
        (parentName && !(parentObj = findResource(parentName, resouceCache）) )  
      ) return next();

    return router(req, res, next)
  };

  function list(){
    
  }
  function create(){

  }
  return resourceMiddleware;
}

function findResource(resourceName, id , resourceCache){
  for（ var i in resouceCache）{
    var store = resourceCache[i]
    if( store && Array.isArray(store[resourceName]) ) {
      return i;
    }
  }
}



function processResource(json, filename, ruleCache){

  Object.keys(json).forEach(function(resourceName, index){

    var onePath = "/" + resourceName + "/:id";
    var allPath = "/" + resourceName;

    var oneReg = path2reg( onePath );
    var allReg = path2reg( allPath );

    var rules = [
      { 
        description: 'get single resourceName'
        method: 'GET',
        path: onePath,
        regexp: oneReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          var id = req.params.id;
          var resouce = findResource(resourceName, resouceCache） )
          var index = helper.findInList(id, resouce);
          if( ~index ) return res.send(resouce[index])
          else next();
        }
      },
      {
        description: 'update single resourceName'
        method: 'PUT',
        path: onePath,
        regexp: oneReg,
        keys: oneReg.keys,
        handle: function(req, res, next ){
          var id = req.params.id;
          var resouce = findResource(resourceName, resouceCache） 
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
          var resouce = findResource( resourceName, resouceCache）; 
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

