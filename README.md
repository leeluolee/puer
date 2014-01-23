##Introduction

easy-to-use static server has livereload & debug(weinre integrated)  function, can be used as connect-middleware




##Feature

1. update css when css file changed
2. refresh page when other filetype changed
3. weinre integrated : use `-i` options
4. can use as connect-middleware
5. can pass addon to support other logic
6. qrcode image at folder page
7. local ips detect


##install
`npm -g install puer`


##Usage

###Command line

in most cases

```bash
cd path/to/your/static/dir
puer 
```

__full options__

list options use `puer -h`

```bash
ubuntu-21:19 ~ $ puer -h

Usage:  puer [options...]

Options:
  -p,--port <port>  server's listen port, 8000 default
  -f,--filetype <typelist>  fileType to watch(split with '|'), defualt 'js|css|html|xhtml'
  -d,--dir <dir>  your customer working dir. default current dir 
  -i,--inspect    start weinre server and debug all puer page
  -x,--exclude    exclude file under watching(must be a regexp), default: ''
  -a,--addon <file> your addon's path
     --no-reload    close  auto-reload feature,(not recommended)
     --no-launch    close the auto launch feature
  -h,--help     help list

```

__tips__: you can use addon javascript to support other mineType, and other logic

```javascript

module.exports = function(app, options){
  app.get(/(.*\.less)/, function(req, res){
    res.send("less file") // you can compile your less file
  })
}

```


###use as [connect|express]-middleware


```javascript
var connect = require("connect")
var path = require("path")
var http = require("http")
var puer = require("puer")
var app = connect()
var server = http.createServer(app)

var options = {
    dir: "path/to/watch/folder", 
    ignored: /(\/|^)\..*|node_modules/  //ignored file
}

app.use(puer.connect(app, server , options))   //use as puer connect middleware
// you must use puer middleware before route and static midleware(before any middle may return 'text/html')
app.use("/", connect.static(__dirname))


server.listen(8001, function(){
    console.log("listen on 8001 port")
})

```

###Changlog

*. v0.1.0 
  1. __puer integretd with weinre now, you can pass `-i` to open, every puer page can  inspect at 9001 port__
  2. support qrcode img generate
  3. support local ip detect

*. v0.0.6 support connect middleware

### TODO

1. sync multiply browser's  action (scroll,form-input,navigate) like Adobe Eadge inspect

###LICENSE
MIT
