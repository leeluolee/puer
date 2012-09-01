sysPath = require "path"
fs =require "fs"
existsSync = fs.existsSync or sysPath.existsSync
url = require "url"

isAjax = (req) ->



generateHTML = (folders, files) ->
  header = 
    """
    <!DOCTYPE HTML>
    <html lang="en-US">
    <head>
      <meta charset="UTF-8">
      <title></title>
    </head>
    <body>
      
    """

  footer = 
    """
    </body>
    </html>

    """

  body = ""



module.exports = (app, server, options) ->
  app.get "/", (req, res, next) ->
    console.log req.headers
    {pathname} = url.parse req.url
    next()

  
   

