sysPath = require "path"
fs =require "fs"
pwd = process.cwd()
existsSync = fs.existsSync or sysPath.existsSync

module.exports = (app, server, homedir = pwd) ->
    app.get /^(.*\.(html|xhtml|htm))$/,(req,res,next) ->
      filepath = sysPath.join pwd, req.params[0]
      filepath = sysPath.join filepath,"index.html" if not existsSync filepath #if not exist append index.html
      if existsSync filepath
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

