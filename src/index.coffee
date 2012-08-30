fs = require 'fs'
sysPath = require 'path'
express = require 'express'
http = require 'http'
io = require 'socket.io'
watch = require 'watch-tree-maintained'
filters = require "./filters"
helper = require "./helper"



# global arg

pwd = process.cwd()
argv = process.argv.slice 2
# ip = util.getLocalIP()
fsExist = fs.existsSync || sysPath.existsSync

# helper function


# autoReload stuff
#   app means express instance
autoReload = (server, app, path = pwd) ->
  # 注意如果没有encoding的参数 则会返回buffer
  # reloadJsContent = fs.readFileSync (sysPath.join __dirname, '..', 'vendor','socket_autoreload.js'), 'utf8'

  # 利用stream在res中输入内容
  app.get "/reload.js" ,(req, res) ->
    helper.send sysPath.join(__dirname,"../", "vendor", "reload.js") , res, "text/javascript"

  # defaults watched file
  matches = ['js','css', 'less', 'html', 'xhtml', 'htm', 'tpl','md', 'markdown', "txt"]
  console.log "watching the flies in #{pwd} and reload||refresh the page" 
  io = io.listen server
  io.sockets.on "connection" , (socket) ->
    watcher = (require "watch-tree-maintained").watchTree path, 
      "match" : "\." + matches.join '$|\\.'
      "sample-rate" : 1 
    watcher.on "fileModified" ,(path) ->
      console.log(path)
      data ="path":path
      # if css file modified   dont't reload page just refresh the link.href
      data.css = path.slice pwd.length if (~path.indexOf ".css")
      socket.emit "update", data

# 1.exposure
##############################################

module.exports = (port = 8008, hasAutoreload = true) ->
      app = express()
      server = http.createServer app

      # inject filter
      for key, filter of filters
        filter app, server, pwd if filters.hasOwnProperty key
      
      app.configure ->
        app.use express.bodyParser()
        app.use express.static pwd  #在当前目录设置server

      ipInfo = ""
      # ipInfo += "\n\t<<#{address}>>   " for address in ip 
      app.server = server
      autoReload server, app if hasAutoreload # start the websocket
      server.listen port, ->       #  start the server
        console.log "server start at localhost:8008"
        console.log "your computer has no-interval ip as follow: #{ipInfo}. choose one for outer watching"
        (require "open") "http://localhost:#{port}"

