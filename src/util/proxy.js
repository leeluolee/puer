var httpProxy = require('http-proxy');
var helper = require('./helper.js');
var libPath = require('path');
var libUrl = require('url');
var fs = require('fs');

var proxy = {
  http: createServer(),
  https: createServer( true )
};


proxy.http.on("proxyRes", function(){
  // console.log(arguments)
})

proxy.http.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Special-Proxy-Header', 'puer');
});


module.exports = function( req, res, options ){
  options = options || {};
  if( typeof options === 'string' ) options = { target: options }

  var url = libUrl.parse( options.target);
  var isHttps = url.protocol === "https";

  options.headers = helper.extend( options.headers || {}, {
    'accept-encoding': 'identity',
    'host': url.host
  })
  console.log(options, req.url)
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