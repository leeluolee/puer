sysPath = require "path"
fs =require "fs"

list = (klass, links, pathname) ->
  ("<a class='#{klass}' href='#{sysPath.join pathname, link}'>#{link}</a>" for link in links).join("\n")

weinre = (inspect) ->
  if(inspect)
    """
    <div class="weinre" >
      <a class="u-ebtn" id='weinre' href='#' target='_blank'>跳转到weinre控制台</a>
    </div>
    """
  else
    ""
listips = (ips, port)->
  url = ""
  for ip in ips
    url += "<li><a href='http://#{ip}:#{port}'>#{ip}:#{port}</a></li>"
  url

toHTML = (files, folders, pathname ,options) ->
  prevpath = pathname.replace /\/[\w-.$]*$/, "" unless pathname is "/"
  prevpath = "/" +prevpath if prevpath? and prevpath.indexOf("/") is -1
  prelink = if prevpath? then "<a class='prevpath' href='#{prevpath}' title='#{prevpath}'>[上级目录]</a>" else ""

  """
  <!DOCTYPE HTML>
  <html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <title>Puer 目录浏览</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" user-scalable="no">
    <link rel="stylesheet" type="text/css" href="/puer/css/folder.css">
    #{weinre options.weinre}
  </head>
  <body>
    <div class="g-doc">
      <h2>当前目录:<strong id="dir">#{pathname}</strong></h2>
      #{prelink}
      #{list 'folder', folders, pathname}
      #{list 'file', files, pathname}
      #{weinre options.inspect}
      <div class="m-qrcode">
        <div id="qrcode">
        </div>
        <h3 class="title">扫描二维码打开本页</h3>
        <div class="m-ips">
          <h3>切换到可用ip地址:</h3>
          <ul>
            #{listips options.ips, options.port}
          </ul>
        </div>
      </div>
    </div>
    <script src="/puer/js/folder.js"></script>

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
      res.noinject = true;
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
        body = toHTML(files, folders, pathname, options)
        res.setHeader "Content-Type", "text/html"
        # not charlength  but bytelength
        res.setHeader "Content-Length", Buffer.byteLength body 
        res.send body
        

      
      
