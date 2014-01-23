##Introduction

puer —— a easy-use static server with livereload  function。

##Feature
1. easy-install : `npm install puer -g`
2. easy-usage: `puer` in 90%

__puer have integretd with weinre now, you can pass `-i` to open inspect__

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

```bash
luobo(master) ✗> puer --help

Usage:  puer [options...]

Options:
  -a,--addon <file> your addon's path

```

__tips__: you can use addon javascript to support

```javascript


module.exports = function(app, options){
  app.get(/(.*\.less)/, function(req, res){
    res.send("less file") // 当然一般会编译了之后发送,这里只是实例
  })
}


```



其实就是加入了一些路由规则而已,具体测试请看test目录

###仅作为connect中间件使用(> v0.0.6)

0.0.6版本的puer把监听部分抽了出来作为connect中间件`require("puer").connect`, 与connect.compress一样，因为拦截了res.write 你必须在static等可能发送html的中间件前的use这个中间件，这部分抽里出来主要是为了__自动刷新NodeJS作为后台的动态网站(比如用模版输出)，只要是content-type 是text/html的response就可以自动刷新__

```javascript
var connect = require("connect")
var path = require("path")
var http = require("http")
var puer = require("puer")
var app = connect()
var server = http.createServer(app)

// 可以配置三个参数, 以下为默认值
var options = {
    dir: "path/to/watch/folder", //__与命令行不同的是必须输入__
    interval: 500, // 监听文件的间隔,同上面的 -t --time参数
    ignored: /(\/|^)\..*|node_modules/  //忽略的监听文件，默认忽略dotfile 和 node_modules
}
// app 为你的connect 实例 或者 express 实例
// server 为 httpServer 实例
// 这里的options就上面所示的三个参数
app.use(puer.connect(app, server ,options))   //puer connect 中间件，要在static等可能发送请求的中间件之前
app.use("/", connect.static(__dirname))



server.listen(8001, function(){
    console.log("listen on 8001 port")
})



```




###Changlog

*. v0.1.0 变动较大
  1. 集成了weinre(参数`-i --inspect`默认端口9001,可在puer folder查看页跳转)
  2. 加入了本地ip列表
  3. 支持folder页的二维码扫描

*. v0.0.6 可以作为connect中间件了， 改为使用更简单的HTML5的SSE实现推送, 解决了内存溢出的问题

### TODO

增加Adobe Edge inspect 的scroll、form、navigate的同步功能。由于无法控制屏幕休眠这种同步可能意义并没有直接提供客户端那么大，好处是跨平台。

###LICENSE
MIT
