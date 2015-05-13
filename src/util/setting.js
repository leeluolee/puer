// handle puer's configure file

var emitable = require('./emitable.js');
var helper = require('./helper');
var fs = require('fs');

function Setting(){
  this._setting = {};
}


var so = emitable( Setting );


so.set = function( key, value ){

}

so.get = function( key ){

}

// so.watch = function( filename ){
//   var self = this, nConfig;
//   helper.watchFile(filename, function(){
//     try {
//       delete require.cache[filename];
//       self._configs = nConfig = require( filename );
//       self.emit( 'change', nConfig )
//     }catch(e){
//       return console.log(e)
//     }

//   })
// }

module.exports = new Setting();


