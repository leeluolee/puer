
var proxifier = require("proxifier");
var injector  = require("injector");
var mocker = require("mocker");
var render = require("render");


module.exports = function ( opt ) {

  var sequence = [ injector(opt),  render(opt), proxifier(opt), mocker(opt) ];

  return function ( req, res, next ){

    var slen = sequence.length;
    var index = 0;

    function step(){

      if( index === slen ) {
        return next()
      }

      return sequence[index]( req, res, step )
    }

    step();
  }
}