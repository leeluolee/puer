fs = require 'fs'
sysPath = require 'path'
http = require 'http'

helper = require "./helper"
addons = require "./addons"



argv = process.argv.slice 2
fsExist = fs.existsSync || sysPath.existsSync

# defaults options
processOptions = (options) ->
  helper.extend options, 
    port:8000
    reload:true
    dir:process.cwd()
    addons:[]
    ignored:[]
    watched:[]

startServer = (server, port, callback) ->
  try
    server.listen port, callback
  catch e
    server.listen port+1, callback

module.exports = (options = {}) ->
      processOptions(options)
      app = do require "express"
      server = http.createServer app
      # init autoreload
      (require "./autoreload") app, server, options if options.reload
      # inject addon
      for key, addon of addons
        addon app, server, options if addons.hasOwnProperty key
      
      app.configure ->
        app.use express.bodyParser()
        app.use express.static options.dir  

      startServer server, options.port, ->       #  start the server
        console.log "server start at localhost:#{options.port}, puer will launch your browser later"
        (require "open") "http://localhost:#{options.port}"

