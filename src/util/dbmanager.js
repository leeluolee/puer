// Maybe provide in next version.
// a resource is represent 

var helper = require('./helper');
var express = require('express');
var fstorm = require('fstorm');
var path = require('path');
var glob = require('glob');
var fs = require('fs');



function FileDB(filename, json){
  this.filename = filename;
  this.json = json || {};
  this.writer = fstorm(this.filename);
}

var fo = FileDB.prototype;


fo.sync = function(){

  if(!this.filename) return;

  try{
    var content = JSON.stringify(this.json, null, 2);
  }catch(e){
    helper.log(this.filename + ' is not a valid json format')
    return;
  }
  this.writer.write(content);
}

fo.add = function(name, obj){

  obj.createAt = +new Date;
  obj.updateAt = +new Date;

  this.json[name].unshift(obj);

  this.sync()
}

fo.find = function(){

}

fo.update = function(){

  this.sync();
}

fo.delete = function(){

  this.sync();
}

fo.list = function(){

}



var onePath = [ "", ':' + RESOURCE_NAME, ':' + ID_NAME ].join("/");
var nestPath = [ "", ':' + PARENT_NAME, ID_NAME, ':'+ RESOURCE_NAME ].join("/");
var allPath = [ "", ':' + RESOURCE_NAME ].join("/");



function DBManager( options ){
  this.store = {};

  var resource = options.resource;

  this.initResource(resource, this.store)
  this.router = this.createRouter();

}


var dmo = DBManager.prototype;

dmo.add = function(filename){

  this.store[filename] = new FileDB( filename );
}

dmo.exists = function( name ){
  for(var i in this.store){
    if( this.store[i].json[name] ) return i;
  }
}

// get target reource list
dmo.resource = function(){

}

dmo.getItem = function(resource, id, query){

}

dom.delItem = function(resource, id, des){

}

dom.updateItem = function(resource, id, obj){

}

dom.getCollection = function(){

}

dmo.findDB = function( name ){ var filename = this.exists(name);

  return filename? this.store[filename].json[name];
}

dmo.findResource = function(name){

}

dmo.findItem = function(){

}

dmo.filter = function(){

}

dmo.createRouter = function(){
  var self = this;
  var router = express.Router();

  router
    .get( allPath, list )
    .get( nestPath, nestList )
    .post( allPath , create )
    .put( onePath, update )
    .get( onePath, read )
    .delete( onePath, del )
    .patch( onePath, update )

  function list(req, res, next){
    var resource = self.get( req );
  }

  function nestList(req, res, next){

  }

  function create(req, res, next){

  }

  function update(req, res, next){

  }

  function read(req, res, next){
    var resource = req.param[RESOURCE_NAME];
    var id = req.param[ID_NAME];
    var file = findResource(resouceName, resourceCache );
    var list = resouceCache[file][resource];

    var res = findInlist(id, list)
    if( res ) res.status( 200 ).send( res )
    else res.send( 404 );
  }

  function delete(req, res, next){
    this.delete(req, function(err){ 
      res.send({})
    })
  }

  return function (req, res, next){

  }
}

dmo.initResource =  function ( pattern){
  var self = this;

  if( typeof pattern === 'string' ){

    glob(pattern, {}, function(err, files){

      if(err) return helper.log(err, 'error');

      files.forEach( self.add.bind(this) );

    })
  }else{
    this.store["$default"] = new FileDB(null, pattern);
  }
}



module.exports = DBManager;

