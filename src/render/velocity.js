var vm = require("velocity");
var path = require("path");

function expressify(options){
  options = options || [];
  return function render( filename, data , callback ) {
    var engine = new vm.Engine({
      template: filename,
      root: options.root ||[]
    });
    callback(null, engine.render( data ));
  }
}


module.exports = expressify;
