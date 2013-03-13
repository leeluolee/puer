sysPath = require "path"
fs =require "fs"

list = (klass, links, pathname) ->
  ("<a class='#{klass}' href='#{sysPath.join pathname, link}'>#{link}</a>" for link in links).join("\n")

toHTML = (files, folders, pathname ) ->
  prevpath = pathname.replace /\/[\w-.$]*$/, "" unless pathname is "/"
  prevpath = "/" +prevpath if prevpath? and prevpath.indexOf("/") is -1
  prelink = if prevpath? then "<a class='prevpath' href='#{prevpath}' title='#{prevpath}'>[上级目录]</a>" else ""

  """
  <!DOCTYPE HTML>
  <html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <title>Puer 目录浏览</title>
    <link rel="stylesheet" type="text/css" href="/css/folder.css">
  </head>
  <body>
    <div class="g-doc">
      <h2>当前目录:<strong id="dir">#{pathname}</strong></h2>
      #{prelink}
      #{list 'folder', folders, pathname}
      #{list 'file', files, pathname}
    </div>
  </body>
  </html> 
  """

module.exports = (app, options) ->
  app.get /(\/.*)/, (req, res, next) ->
    # /public/to/path
    pathname = req.params[0]
    # /f/dir/public/to/path
    path = sysPath.join options.dir, pathname
    fs.stat path, (err, stats) ->
      return next() if err? or not stats.isDirectory()
      files = []
      folders = []
      fs.readdir path, (err, subs) ->
        return next() if err?
        # file = some.js
        subs.forEach (file) ->
          #/f/dir/public/to/path/some.js
          filepath = sysPath.join path,file
          files.push file if fs.statSync(filepath).isFile()
          folders.push file if fs.statSync(filepath).isDirectory()
        body = toHTML(files, folders, pathname)
        res.setHeader "Content-Type", "text/html"
        # not charlength  but bytelength
        res.setHeader "Content-Length", Buffer.byteLength body 
        res.send body
        

      
      
