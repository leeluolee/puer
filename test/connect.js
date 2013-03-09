var connect = require("connect")
var path = require("path")
var http = require("http")

var app = connect()

app.use(require(path.join(__dirname,"../lib/index")).connect(app, {dir: __dirname}))
app.use("/", connect.static(__dirname));
app.use("/", connect.directory(__dirname));

http.createServer(app).listen(80, function(){
    console.log("listen on 80 port")
})


