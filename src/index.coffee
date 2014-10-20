# http://tomkersten.com/articles/server-sent-events-with-node/
# module 
http = require 'http'
path = require 'path'
express = require 'express'
httpProxy = require 'http-proxy'
connectPuer = require './connect-puer'
require 'coffee-script'
weinre = require 'weinre'
os = require 'os'
qrcode = require 'qrcode-npm'
url = require 'url'




# local module
helper = require "./helper"

cwd = do process.cwd



processOptions = (options) ->
  helper.merge options, 
    # listener port
    port:8000
    # auto-reload  
    reload:true
    # working folder
    dir: cwd
    # autemate launch browser
    launch: true
    # plugins (generally, will be some route-rules, see src/addons folder to get help)
    addon: null
    proxy:null


  
  



puer = module.exports = (options = {}) ->
      # pre options
      processOptions(options)

      options.dir = path.resolve cwd, options.dir
      options.ips = []
      options.inject=[]

      ifaces = os.networkInterfaces()
      for dev of ifaces
        ifaces[dev].forEach (details) ->  
          if (details.family=='IPv4' and details.address != '127.0.0.1')
            options.ips.push(details.address);
            


      app = do express
      server = http.createServer app         
      # init autoreload
      # (require "./autoreload") app, server, options if options.reload
      
      app.use connectPuer(app, server, options)


      if options.proxy
        proxy = httpProxy.createProxyServer {}
        proxy.on "error", (err, req, res)->
          res.writeHead(500, {
            "Content-Type": 'text/plain'
          })
         



      
      genQr = (content, start) -> 
        start ?= 2;
        try
          qr = qrcode.qrcode start, 'L'
          qr.addData(content or '')
          qr.make()
          return qr;
        catch err
          if start> 8
            throw err
          else 
            return genQr(content, start + 2)

      # generate qrcode
      app.get '/puer/qrcode', (req, res, next)->
        query = url.parse(req.url,true).query
        res.send 
          code: 200
          result: genQr(query.url, 2).createImgTag(4)
          


      # only one addon(markdown) is default provide
      # addon app, options for own key, addon of helper.requireFolder path.join __dirname, "./addons"
        # config express 
      try 
        require(path.resolve __dirname, options.addon)(app, options) if options.addon
      catch err

      if options.inspect
        weinre.run 
          httpPort: 9001
          boundHost: '-all-'
          verbose:false
          debug: false
          readTimeout: 20
          deathTimeout: 50 
        options.inject.push(
          """
          <script>
            var url = 'http://'+location.host.replace(/\:\\d+/, '') +':9001'+ '/target/target-script-min.js#anonymous' 
            var script = document.createElement('script');
            script.src = url;
            var head = document.head;
            if(head){
              head.appendChild(script);
            }
            
          </script>
          """
        )
          
      
        

      # folder view
      # app.use express.directory options.dir
      # then customer's folder


      if not options.proxy 
        app.use express.static options.dir
      else 
        app.use (req, res, next)->
          proxy.web req, res, { target: options.proxy }, (err)-> 
            if err then console.error("some error occurs")



      #  start the server
      server.listen options.port, (err)->
        if(err) then return helper.log "port confict, please change port use -h to show the help", "err"
        helper.log "server start at localhost:#{options.port}"
        if options.launch then helper.openBrowser "http://localhost:#{options.port}", (err) ->
          helper.log(err or "puer will lauch your default browser")


puer.connect = connectPuer

