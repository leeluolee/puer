var extend = require('./helper').extend;
var slice = [].slice;

var generics = {
  on: function( type, fn ) {

    if( typeof type === 'object' ){
      for (var i in type) {
        this.on(i, type[i]);
      }
    }else{
      var handles = this._handles || (this._handles = {}),
        calls = handles[type] || (handles[type] = []);

      calls.push(fn);
    }
    return this;
  },
  off: function(type, fn) {
    if( !type || !this._handles ) this._handles = {};
    if( !this._handles ) return this;

    var handles = this._handles , calls;

    if (calls = handles[type]) {
      if ( !fn ) {
        handles[type] = [];
        return this;
      }
      for (var i = 0, len = calls.length; i < len; i++) {
        if ( fn === calls[i] ) {
          calls.splice(i, 1);
          return this;
        }
      }
    }

    return this;
  },
  emit: function( type ){
    var args = slice.call(arguments, 1),
      handles = this._handles, calls;

    if (!handles || !(calls = handles[type])) return this;

    for (var i = 0, len = calls.length; i < len; i++) {
      calls[i].apply(this, args)
    }

    return this;
  },
  once: function( type, fn ){

    var callback = function(){

      fn.apply(this, arguments)
      this.off(type, callback)
    }

    return this.on(type, callback)
  }
}

module.exports = function(obj){

  obj = typeof obj == "function" ? obj.prototype : obj;
  return extend(obj, generics)
}