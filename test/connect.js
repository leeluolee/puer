var connect = require("express")
var path = require("path")
var http = require("http")

var app = connect()
var server = http.createServer(app)

app.use(require(path.join(__dirname,"../lib/index")).connect(app, server ,{
  dir: __dirname
}))
app.use("/", connect.static(__dirname));
app.use("/", connect.directory(__dirname));

app.use("/home", function(req, res, next){
    res.setHeader("content-type", "text/html")
    res.send('<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body></body></html>')
})

server.listen(8001, function(){
    console.log("listen on 8001 port")
})


