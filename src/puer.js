
var emitable = require('./util/emitable.js');
var helper = require('./util/helper.js');

function Puer ( options ){
  this._options = options || {};
  this._plugins = {};
}


var proto  = emitable(Puer);


proto.set = function( name, value, options ){
  if(typeof name === 'object'){
    for(var i in name){
      this.set(i, name[i], value)
    }
    return this;
  }

  var oldValue = this._options[ name ];
  this._options[ name ] = value;

  this.emit( 'change:' + name, value, oldValue);
}


proto.get = function(key){
  return this._options[key];
}


proto.addPlugin = function(name, definition){

}




module.exports = new Puer();







