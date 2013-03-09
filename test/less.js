var less = require('less');
var fs = require("fs");
var path = require("path");

/**
 * [exports description]
 * @param  {[type]} app     express(connect) instance
 * @param  {[type]} server  http server instance
 * @param  {[type]} options 见下表
                    # listener port
                    port:8000
                    # auto-reload  
                    reload:true
                    # working folder
                    dir:process.cwd()
                    # autemate launch browser
                    launch:true
                    # plugins (generally, will be some route-rules, see src/addons folder to get help)
                    addon:null
                    # ignored watching type
                    matches:['\\.(js|css|html|htm|xhtml|md|markdown|txt|hbs|jade)$']
                    # add watching file *tips:excludes has a priority higher than ex 
                    excludes:['node_modules']
  这些初始参数会与命令行传入的参数进行合并
 *
 */
module.exports = function(app, server , options){
  app.get(/(.*\.less)/, function(req, res){
    file = fs.readFileSync(path.join(options.dir,req.params[0]),"utf8")
    if(!file) return ""
    less.render(file, function (e, css) {
      res.setHeader("Content-Type", "text/css")
        res.setHeader("Content-Length", Buffer.byteLength (css)) 
        res.send(css)
    });
  })
}
