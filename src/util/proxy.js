var httpProxy = require('http-proxy');
var helper = require('./helper.js');
var libPath = require('path');
var libUrl = require('url');
var fs = require('fs');

var proxy = {
  http: createServer(),
  https: createServer( true )
};




function handleError( err, req, res ){
  if(err && err.code === 'ECONNRESET') return res.send('end');
  else{
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong with proxy request, url ' + req.url);
  }
}

function attachHeader(proxyReq){
  proxyReq.setHeader('X-Special-Proxy-Header', 'PUER');
}


proxy.http.on('error', handleError)
proxy.https.on('error', handleError)

proxy.https.on('proxyReq', attachHeader);
proxy.http.on('proxyReq', attachHeader);

// proxy.http.on('proxyRes', function(proxyRes, req, res){
//   console.log('proxyRes')
//   // console.log('proxyRes', req.url)

// });


module.exports = function( req, res, options ){
  options = options || {};
  if( typeof options === 'string' ) options = { target: options }

  var url = libUrl.parse( options.target);
  var isHttps = url.protocol === "https";


  if(options.onload) req.onload = options.onload;
  return proxy[ (isHttps?'https': 'http') ].web(req, res, options);
}


function createServer(ssl, notPrepend){
  var options = { secure: false }

  if( ssl ) options.ssl = {
    key: fs.readFileSync(libPath.join( __dirname, '../resource/cert', 'proxy-key.pem'), 'utf8'),
    cert: fs.readFileSync(libPath.join( __dirname, '../resource/cert', 'proxy-cert.pem'), 'utf8')
  }


  return httpProxy.createServer( options )

}



