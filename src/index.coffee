# module 
http = require 'http'
express = require 'express'
sysPath = require "path"

# local module
helper = require "./helper"

# defaults options
processOptions = (options) ->
  helper.extend options, 
    port:8000
    reload:true
    # working folder
    dir:process.cwd()
    # autemate launch browser
    launch:true
    # plugins (generally, will be some routing rules)
    addons:[]
    # ignored watching type
    ignored:[]
    # add watching file
    watched:[]

# solve network port conflict
restarted = 0
startServer = (server, port, callback) ->
  try
    server.listen port, callback
  catch e
    if restarted < 10 then startServer server, port + (++restarted), callback
    else throw e

module.exports = (options = {}) ->
      # pre options
      processOptions(options)
      app = do express
      server = http.createServer app
      # init autoreload
      (require "./autoreload") app, server, options if options.reload
      
      # inject addon
      addon app, server, options for own key, addon of helper.requireFolder sysPath.join __dirname, "./addons"

      # config express 
      app.configure ->
        app.use express.bodyParser()
        # first search lib related static folder
        app.use express.static options.dir  
        # then customer's folder
        app.use express.static sysPath.join __dirname, "..", "vendor"  

      #  start the server
      startServer server, options.port, ->       
        console.log "server start at localhost:#{options.port}, puer will launch your browser later"
        (require "open") "http://localhost:#{options.port}"

