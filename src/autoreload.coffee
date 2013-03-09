sysPath = require "path"
fs =require "fs"

module.exports = (app, server, options) ->

  io = (require 'socket.io').listen server
  io.set("log level", 1)
  io.sockets.on "connection" , (socket) ->
    watcher = (require "watch-tree-maintained").watchTree options.dir, 
      "ignore": options.excludes.join("|")
      "match" : options.matches.join("|")
      "sample-rate" : 1 

    watcher.on "fileModified" ,(path) ->
      data = "path": path
      # if css file modified   dont't reload page just update the link.href
      data.css = path.slice options.dir.length if ~path.indexOf ".css"
      socket.emit "update", data
