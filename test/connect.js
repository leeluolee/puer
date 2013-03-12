var connect = require("express/node_modules/connect")
var path = require("path")
var http = require("http")

var app = connect()

app.use(require(path.join(__dirname,"../lib/index")).connect(app, {dir: __dirname}))
app.use("/", connect.static(__dirname));
app.use("/", connect.directory(__dirname));
app.use("/home", function(req, res){
    res.setHeader("content-type", "text/html")
    res.write("<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body></body></html>")
    res.end()
})

http.createServer(app).listen(8001, function(){
    console.log("listen on 8001 port")
})


