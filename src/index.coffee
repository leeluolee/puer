# http://tomkersten.com/articles/server-sent-events-with-node/
# module 
http = require 'http'
path = require 'path'
express = require 'express'
connectPuer = require './connect-puer'


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

    # dotfile  node_modules
    ignored: /(\/|^)\..*|node_modules/

    interval: 600

    manual: false

  
  



puer = module.exports = (options = {}) ->
      # pre options
      processOptions(options)

      options.dir = path.resolve cwd, options.dir

      app = do express
      # init autoreload
      # (require "./autoreload") app, server, options if options.reload
      

    
        
      app.use connectPuer(app, options) if options.reload

      # only one addon(markdown) is default provide
      addon app, options for own key, addon of helper.requireFolder path.join __dirname, "./addons"
        # config express 
      try 
        require(path.resolve __dirname, options.addon)(app, options) if options.addon
      catch err
        
      # folder view
      # app.use express.directory options.dir
      # then customer's folder
      app.use express.static options.dir

     
      #  start the server
      server = (http.createServer app).listen options.port, (err)->
        if(err) then return helper.log "port confict, please change port use -h to show the help", "err"
        helper.log "server start at localhost:#{options.port}"
        if options.launch then helper.openBrowser "http://localhost:#{options.port}", (err) ->
          helper.log(err or "puer will lauch your default browser")         


puer.connect = connectPuer

