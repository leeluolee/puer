sysPath = require "path"
fs =require "fs"
marked = require 'marked'

existsSync = fs.existsSync or sysPath.existsSync

module.exports = (app, server, options = {}) ->

  app.get /^\/(.*\.(?:markdown|md|txt))$/, (req, res, next) ->
    path = sysPath.join options.dir, req.params[0]
    if existsSync path
      fs.readFile path, "utf8", (err, data) ->
        markdown = marked data
        resBody = 
          """
          <!DOCTYPE HTML>
          <html lang="en-US">
          <head>
            <meta charset="UTF-8">
            <title>markdown</title>
            <link href='/css/markdown.css' rel='stylesheet'/>
            #{if options.reload then "<script src='/js/reload.js'></script>" else ""}
            <script src='/js/pretty.js'></script>
          </head>
          <body onload="highlight()">
           #{markdown} 
          </body>
          </html>  
          """
        res.setHeader "Content-Type", "text/html"
        # not charlength  but bytelength
        res.setHeader "Content-Length", Buffer.byteLength resBody 
        res.send resBody

      




  



