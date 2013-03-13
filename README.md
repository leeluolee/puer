#Puer 
一个在当前(或指定目录)开启静态服务器的命令行工具，css刷新样式，其它刷新页面.是的，跟F5差不多

__新版本去除了socket.io的依赖, 改为使用[SSE](http://en.wikipedia.org/wiki/Server-sent_events)代替, 所以IE不支持了__


##安装 
`npm -g install puer`

当然你也可以fork一份自己折腾:

`git clone https://github.com/leeluolee/puer`


##使用

###命令行
__90%__的情况下, 你应该是这样用的...
```bash
cd path/to/your/static/dir #到你想去地方
puer #泡一杯普洱

```
或许你想更__深入__一点...
```bash
luobo(master) ✗> puer --help

Usage:  puer [options...]

Options:
  -a,--addon <file> your addon's path
  -p,--port <port>  server's listen port, 8000 default
  -d,--dir <dir>  your customer working dir. default current dir 
     --no-reload    close  auto-reload feature,(not recommended)
     --no-launch    close the auto launch feature
  -i,--ignored <regexp> ignored file under watching
  -t,--time <ms>  watching interval time (ms), default 500ms
  -h,--help     help list
           help list

```

其中, __addon__代表你可以传入一个自己的脚本(通常是路由定义用以测试, 也可以拦截.less这些资源请求), 这个模块输出一个函数, 可以获得当前的express的app实例，以及命令行传入的options(一般没啥用)

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

// 可以配置三个参数, 以下为默认值
var options = {
    dir: "path/to/watch/folder", //__与命令行不同的是必须输入__
    interval: 500, // 监听文件的间隔,同上面的 -t --time参数
    ignored: /(\/|^)\..*|node_modules/  //忽略的监听文件，默认忽略dotfile 和 node_modules
}
// app 为你的connect 实例 或者 express 实例
// 这里的options就上面所示的三个参数
app.use(puer.connect(app, options))   //puer connect 中间件，要在static等可能发送请求的中间件之前
app.use("/", connect.static(__dirname))



http.createServer(app).listen(8001, function(){
    console.log("listen on 8001 port")
})



```




###Changlog

1. v0.0.6 可以作为connect中间件了， 改为使用更简单的HTML5的SSE实现推送, 解决了内存溢出的问题

###LICENSE
MIT
