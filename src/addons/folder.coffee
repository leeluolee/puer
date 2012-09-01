sysPath = require "path"
fs =require "fs"
existsSync = fs.existsSync or sysPath.existsSync
url = require "url"
{send} = require "../helper"

list = (klass, links) ->
  ("<a class='#{klass}' href='#{link}'>#{link}</a>" for link in links).join("\n")

toHTML = (files, folders, pathname ) ->
  prevpath = "/"+pathname.split("/")[0..-1].join "/" if pathname is not "/"
  prelink = if prevpath? then "<a class='prevpath' href='#{prevpath}' title='#{prevpath}'>[上级目录]</a>" else ""

  """
  <!DOCTYPE HTML>
  <html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <title>目录浏览</title>
    <link rel="stylesheet" type="text/css" href="/css/folder.css">
  </head>
  <body>
    <div class="g-doc">
      <h2>当前目录:<strong id="dir">#{pathname}</strong></h2>
      #{prelink}
      #{list 'folder', folders}
      #{list 'file', files}
    </div>
  </body>
  </html> 
  """



module.exports = (app, server, options) ->
  app.get /\/(.*)/, (req, res, next) ->
    {pathname} = url.parse req.url
    path = sysPath.join options.dir, pathname
    fs.stat path, (err, stats) ->
      return next() if err? or not stats.isDirectory()
      files = []
      folders = []
      fs.readdir path, (err, subs) ->
        return next() if err?
        subs.forEach (file) ->
          filepath = sysPath.join path,file
          # todo
          files.push file if fs.statSync(filepath).isFile()
          folders.push file if fs.statSync(filepath).isDirectory()
        body = toHTML(files, folders, pathname)
        res.setHeader "Content-Type", "text/html"
        # not charlength  but bytelength
        res.setHeader "Content-Length", Buffer.byteLength body 
        res.send body
        

      
      

