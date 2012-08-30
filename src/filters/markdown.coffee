sysPath = require "path"
fs =require "fs"
marked = require 'marked'
pwd = process.cwd()
existsSync = fs.existsSync or sysPath.existsSync
{send} = require("../helper")

module.exports = (app, server, homedir = pwd ) ->
  app.get "/css/markdown.css", (req, res, next)->
    send sysPath.join(__dirname, "../..", "vendor/css/markdown.css"), res, "text/css"

  app.get "/pretty.js", (req, res, next) -> 
    send sysPath.join(__dirname, "../..", "vendor/pretty.js"), res, "text/javascript"
    
  app.get /^\/(.*\.(?:markdown|md|txt))$/, (req, res, next) ->
    path = sysPath.join homedir, req.params[0]
    if existsSync path
      fs.readFile path, "utf8", (err, data) ->
        marked.setOp
        markdown = marked data
        resBody = 
          """
          <!DOCTYPE HTML>
          <html lang="en-US">
          <head>
            <meta charset="UTF-8">
            <title>markdown</title>
            <link href='/css/markdown.css' rel='stylesheet'/>
            <script src='/reload.js'></script>
            <script src='/pretty.js'></script>
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

      




  



