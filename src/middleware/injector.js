
var proxy = require("../util/proxy");

module.exports = function injectify( options ){

  var excludes = options.excludes || [];

  return function( req, res, next ){
    if(options.before) options.before(req, res);

    var oWriteHead = res.writeHead;
    var oWrite = res.write;
    var oEnd = res.end;

    res.proxy = function( options ){
      proxy(req, res, options);
    }

    res.push = function (chunk){
      res.data = res.data || "";
      res.data +=  chunk||"";
    }

    res.write = function( chunk, encoding ){
      if(!isHtml(res)) return oWrite.apply( res, arguments );
      if(!chunk) return;
      return res.push( (chunk instanceof Buffer)? chunk.toString(): chunk||'')
    }

    res.writeHead = function() {
      if ( res.noinject ) return oWriteHead.apply(res, arguments);
      if ( res.getHeader('content-length') ) res.removeHeader('content-length');
      return oWriteHead.apply(res, arguments);
    }


    res.end = function( chunk, encoding ){
      if ( res.noinject ){
        return oEnd.apply( res, arguments );
      }

      res.noinject = true;
      res.push(chunk);
      res.write = oWrite;
      chunk = res.data
      if( (chunk || !isHtml(res))  ){
        chunk = wrap(res.data);
        if(res._header){
          res.addTrailers({ 'content-length': Buffer.byteLength( chunk, encoding) });
        }else{
          res.setHeader( 'content-length', Buffer.byteLength( chunk, encoding) ); 
        }
      }
      oEnd.call(res, chunk, encoding);
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
function wrap( trunk ){
  return trunk.replace(/\<body[\s\S]*?\>/, function(all){
    return all + "<h2>Title</h2>"
  })
}

/**
 * accept MineTypesform injector
 * @type {RegExp}
 */
var acceptMineTypes = /\b(xhtml|html|htm|xml)\b/ 

function isHtml( res ){
  return acceptMineTypes.test(res.getHeader("content-type")) 
}

