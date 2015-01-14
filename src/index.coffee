# http://tomkersten.com/articles/server-sent-events-with-node/
# module 
fs = require 'fs'
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
Router = require 'express/lib/router/index'





# local module
helper = require "./helper"

cwd = do process.cwd


watchFile = (filename, callback) ->
  isWin = process.platform == 'win32'
  if isWin
    fs.watch filename, (event) -> 
        if event == 'change' then callback(filename)
  else 
    fs.watchFile filename, {interval: 200}, (curr, prev)->
        if curr.mtime > prev.mtime then callback(filename);


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
      if options.proxy
        proxy = httpProxy.createProxyServer {}


      if !options.proxy
        addon app, options for own key, addon of helper.requireFolder path.join __dirname, "./addons"
        app.use express.static options.dir
        # config express 



      if options.addon
          addon = name: path.resolve __dirname, options.addon

          #TODO
          restRoute = ()->
            # change the cache routes
            try
              addon.router = new Router app;

              delete require.cache[addon.name];
              addon.routes = require addon.name;

              for own pt, callback of addon.routes
                type = typeof callback;
                tmp = pt.split /\s+/  
                if tmp.length > 1
                  pt = tmp[1]
                  method = tmp[0]
                else
                  pt = tmp[0]
                  method = 'GET'
                if type is "string"
                  callback = do (callback)->
                    return (req, res, next)->
                      fs.readFile path.join( path.dirname(options.addon), callback), 'utf8', (err, content)->
                        if not err 
                          res.send content
                        else
                          next()
                if type is "array" or type is 'object'
                  callback = do (callback)->
                    return (req, res, next)->
                      res.send(callback)

                addon.router.route(method, pt, callback)
              helper.log("addon update !!!" + addon.name)
            catch e
              helper.log(e.message, "error")



          restRoute();
          watchFile addon.name, restRoute
          


          app.use (req, res, next)->
            if addon.router
              route = addon.router.matchRequest(req)
              if route && route.callbacks && route.callbacks[0]
                req.params = route.params
                route.callbacks[0].call(app, req, res, next)
              else 
                next()
            else 
              next()




      if options.proxy 
        proxy.on 'proxyRes', (proxyRes, req, res, options)-> 
           
        app.use (req, res, next)->
          proxy.web req, res, { target: options.proxy } , (err)->
            # console.log(err)



      #  start the server
      server.listen options.port, (err)->
        if(err) then return helper.log "port conflict, please change port use -h to show the help", "err"
        helper.log "server start at localhost:#{options.port}"
        if options.launch then helper.openBrowser "http://localhost:#{options.port}", (err) ->
          helper.log(err or "puer will launch your default browser")


puer.connect = connectPuer

