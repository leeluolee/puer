var path = require("path");

module.exports = function(app, options){
  app.get(/(.*\.less)/, function(req, res){
    res.send("less file")
  })
}
