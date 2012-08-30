sysPath = require "path"
fs =require "fs"
helper = require './helper'

module.exports = (app, server, options) ->

  # addon resource define
  app.get "/reload.js" ,(req, res) ->
    helper.send sysPath.join(__dirname,"../", "vendor", "reload.js") , res, "text/javascript"

  # defaults watched file
  matches = ['js','css', 'less', 'html', 'xhtml', 'htm', 'tpl','md', 'markdown', "txt"]

  io = (require 'socket.io').listen server
  io.set("log level", 1)
  io.sockets.on "connection" , (socket) ->
    watcher = (require "watch-tree-maintained").watchTree options.dir, 
      "match" : "\." + matches.join '$|\\.'
      "sample-rate" : 1 
    watcher.on "fileModified" ,(path) ->
      data ="path":path
      # if css file modified   dont't reload page just update the link.href
      data.css = path.slice pwd.length if (~path.indexOf ".css")
      socket.emit "update", data
