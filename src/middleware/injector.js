
var proxy = require("../util/proxy");


module.exports = function injectify( options ){

  var excludes = options.excludes || [];
  var resource = options.resource;

  return function( req, res, next ){
    if(typeof options.before === 'function') options.before(req, res);

    var oWriteHead = res.writeHead;
    var oWrite = res.write;
    var oEnd = res.end;


    res.injector = Array.isArray(res.injector)? res.injector: [];

    res.__data = new Buffer('','utf8');


    res.proxy = function(options){
      req.url = "";
      return proxy(req, res, options)
    }
    res.push = function (chunk){
      if(!chunk) return;
      if(!Buffer.isBuffer(chunk)) chunk = new Buffer(chunk, 'utf8');
      res.__data = Buffer.concat([res.__data, chunk]);
      // res.__data = res.__data || '';
      // res.__data +=  chunk||"";
    }

    res.write = function( chunk, encoding ){
      // if(!isHtml(res) ) return oWrite.apply( res, arguments );
      if(!chunk) return;
      // console.log(chunk.toString('utf8'), res.getHeader('content-type'));
      return res.push( Buffer.isBuffer( chunk )?  chunk :new Buffer( chunk, encoding || 'utf8') )
      // return res.push( Buffer.isBuffer( chunk )? chunk.toString('utf8'): chunk );
    }


    res.writeHead = function() {

      if ( res.noinject ) return oWriteHead.apply(res, arguments);
      if ( res.getHeader('content-length') ) res.removeHeader('content-length');
      return oWriteHead.apply(res, arguments);
    }

    res.end = function( chunk, encoding, twice){
      
      if(options.delay && !twice ) {
        return setTimeout(function(){
          res.send(chunk, encoding, true)
        }, options.delay)
      }
      if ( res.noinject ){
        return oEnd.apply( res, arguments );
      }

      res.noinject = true;
      res.push(chunk);
      res.write = oWrite;
      var allChunk = res.__data
      if(typeof res.puer_transform === 'function' && allChunk){
        allChunk = res.puer_transform(allChunk);
      }
      if( isHtml(res)  ){
        allChunk = wrap(allChunk, res.injector);
        if(res._header){
          res.addTrailers({ 'content-length': Buffer.byteLength( allChunk, encoding) });
        }else{
          res.setHeader( 'content-length', Buffer.byteLength( allChunk, encoding) ); 
        }
      }
      oEnd.call(res, allChunk, encoding);
    }

    if(options.after) options.after(req, res);
    next();
  }

}

/**
 * wrap
 * @param  {[type]} trunk [description]
 * @return {[type]}       [description]
 */
function wrap( trunk , injector){

  var res =  trunk.toString('utf8').replace(/\<body[\s\S]*?\>/, function(all){
    return all + (Array.isArray(injector)? injector.join(""): injector || '');
  })
  return res;
}

function concat (buffers, length){
  var buffer = null;
  switch(buffers.length) {
      case 0: buffer = new Buffer(0);
          break;
      case 1: buffer = buffers[0];
          break;
      default:
          buffer = new Buffer(nread);
          for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
              var chunk = buffers[i];
              chunk.copy(buffer, pos);
              pos += chunk.length;
          }
      break;
  }
  return buffer;
}

/**
 * accept MineTypesform injector
 * @type {RegExp}
 */
var acceptMineTypes = /\b(xhtml|html|htm|xml)\b/ 

function isHtml( res ){
  return acceptMineTypes.test(res.getHeader("content-type")) 
}

