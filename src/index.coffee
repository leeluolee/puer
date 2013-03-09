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
    dir:process.cwd()
    # autemate launch browser
    launch:true
    # plugins (generally, will be some route-rules, see src/addons folder to get help)
    addon:null

    ignored: /\.\w*|node_modules.*/

  
  



puer = module.exports = (options = {}) ->
      # pre options
      processOptions(options)

      app = do express
      # init autoreload
      # (require "./autoreload") app, server, options if options.reload
      
      # inject addon
      # addon app, server, options for own key, addon of helper.requireFolder path.join __dirname, "./addons"
      # require(options.addon) app, server, options if options.addon
      # config express 
      app.use connectPuer(app, {dir: path.join __dirname, "../vendor" })
      # first search lib related static folder
      app.use express.static path.join __dirname, "../vendor" 
      app.use express.directory options.dir

      # then customer's folder
      app.use express.static path.resolve cwd, options.dir

     
      
      #  start the server
      server = (http.createServer app).listen options.port, ->
        helper.log "server start at localhost:#{options.port}"
        if options.launch then helper.openBrowser "http://localhost:#{options.port}", (err) ->
          helper.log(err or "puer will lauch your default browser")         


puer.connect = connectPuer

