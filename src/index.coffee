'use strict'
fs = require 'fs'
sysPath = require 'path'
express = require 'express'
http = require 'http'
io = require 'socket.io'
watch = require 'watch-tree-maintained'
{util} = require './helper'


# global arg

pwd = process.cwd()
argv = process.argv.slice 2
ip = util.getLocalIP()
fsExist = fs.existsSync || sysPath.existsSync

# helper function


# autoReload stuff
#   app means express instance
autoReload = (server, app, path = pwd) ->

  # 注意如果没有encoding的参数 则会返回buffer
  # reloadJsContent = fs.readFileSync (sysPath.join __dirname, '..', 'vendor','socket_autoreload.js'), 'utf8'
  # reloadJsContent +=

  # 利用stream在res中输入内容
  app.get "/reload.js" ,(req, res) ->
    res.setHeader "Content-Type", "text/javascript"
    
    stream = fs.createReadStream (sysPath.join __dirname, '..', 'vendor','socket_autoreload.js'), encoding : 'utf8'
    stream.pipe res, end: false;

    stream.on "end", ->
      console.log "stream end"
      res.write """
      window.onload=function(){
        var location = window.location,
            origin = location.protocol+"//"+location.host;
        var socket = io.connect(origin); 
        var stylesheets = document.getElementsByTagName("link");
        var cacheBuster = function(url){
            var date = Math.round(+new Date/1000).toString();
            url = url.replace(/(\\&|\\\\?)cacheBuster=\\d*/, '');
            return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
        };
        var updateStyle = function(stylePathName){
          for(var i = stylesheets.length;i--;){
            var href = stylesheets[i].getAttribute("href");
            stylesheets[i].setAttribute("href",cacheBuster(stylesheets[i].getAttribute("href")));
          }
          return true;
        }
        socket.on('update', function(data){
          if(data.css && updateStyle(data.css)) return true;
          window.location.reload();     
        })
      }
      """
      res.end()

    req.on 'close', ->
      stream.destroy();


  # 捕获所有html.xhtml的内容 TODO: 自动注入script
  # app.get /(.*\/\w*.(?:html|htm|xhtml))$/, (req, res, next) ->
  #   res.send req.params
  # pre insert script
  # watch file
  matches = ['js','css', 'less', 'html', 'xhtml', 'htm', 'tpl','md', 'markdown']
  console.log "watching the flies in #{pwd} and reload||refresh the page" 
  io = io.listen server
  io.sockets.on "connection" , (socket) ->
    watcher = (require "watch-tree-maintained").watchTree path, 
      "match" : "\." + matches.join '$|\\.'
      "sample-rate" : 1 

    watcher.on "fileModified" ,(path) ->
      data ="path":path
      # if css file modified   dont't reload page just refresh the link.href
      data.css = path.slice pwd.length if (~path.indexOf ".css")
      socket.emit "update", data

# 1.exposure
##############################################

module.exports = (port = 8008, hasAutoreload = true) ->
      app = express()
      if hasAutoreload 
        # watch all html request and inject /reload.js 
        app.get /^(.*(\.html))$/,(req,res,next) ->
          filepath = sysPath.join pwd, req.params[0]
          filepath = sysPath.join filepath,"index.html" if not fsExist filepath #if not exist append index.html
          if fsExist filepath
            file = fs.readFileSync filepath,"utf8"
            if not ~file.indexOf "/reload.js"
              seps = file.split "</head>"  #TODO: 直接操作字符串 性能太差
              seps.splice 1 ,0 ,'<script src="/reload.js"></script></head>'
              file = seps.join ""
            res.setHeader "Content-Type", "text/html"
            # not charlength  but bytelength
            res.setHeader "Content-Length", Buffer.byteLength file 
            res.send file
          else 
            next()

      app.configure ->
        app.use express.bodyParser()
        app.use express.static pwd  #在当前目录设置server

      ipInfo = ""
      ipInfo += "\n\t<<#{address}>>   " for address in ip 
      server = http.createServer app
      autoReload server, app if hasAutoreload # start the websocket
      server.listen port, ->       #  start the server
        console.log "server start at localhost:8008"
        console.log "your computer has no-interval ip as follow: #{ipInfo}. choose one for outer watching"
        (require "open") "http://localhost:#{port}/index.html"

