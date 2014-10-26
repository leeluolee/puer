



> __Puer - more than a live-reload server , built for efficient frontend development__


[中文指南](http://leeluolee.github.io/2014/10/24/use-puer-helpus-developer-frontend/)


##Feature


1. __create static server__ at target dir (default in current dir)
2. __auto reload__ : css will update style, other file will reload the page.
3. __weinre integrated__  use `-i` options
4. __proxy server mode__, use it with exsiting server
5. __http request mock__ by `-a` addon，the addon is also __live reload__
6. __connect-middleware__ support


##install
`npm -g install puer`


##Usage

###Command line

in most cases

```bash
cd path/to/your/static/dir
puer 
```

![puer-step-1](http://leeluolee.github.io/attach/2014-10/puer-step-1.gif)

puer will launch the browser for you. all pages is __live-reload__

### __full options__

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
  -a,--mock <file> your mock's path
  -t,--target <url> remote proxy server
     --no-reload    close  auto-reload feature,(not recommended)
     --no-launch    close the auto launch feature
  -h,--help     help list

```


###__mock request__

during development ，you may need mock request . use `-a <addon>` to help you mock dynamic api

```shell
puer -a route.js
```

the `route.js` seems like

```javascript
// use addon to mock http request
module.exports = {
  // GET
  "GET /v1/posts/:id": function(req, res, next){
	// response json format
    res.send({
      title: "title changed",
      content: "tow post hahahah"
    })

  },
  // PUT POST DELETE is the same
  "PUT /v1/posts/:id": function(){

  },
  "POST /v1/posts": function(){

  },
  "DELETE /v1/posts/:id": function(){

  }
}          

```

It is just a  config for routers, you need export a [Object] contains router config. the keys is join with 【METHOD】 and 【PATH】, and the  values represent the callback。this function is based on [express](http://expressjs.com)'s router, you can check its document for more help。

__[【check the  usage record 】](http://leeluolee.github.io/attach/2014-10/puer-step-2.gif)__

once the `route.js` changed, puer will hot refresh it. there is no need to restart puer.



###__proxy support__

you can use `-t` or `--target` to use puer with exsiting server, image that you already have a server run at 8020 port. 

```javascript
puer -t http://localhost:8020
```

__[【check the recor for proxy mode】](http://leeluolee.github.io/attach/2014-10/puer-step-3.gif)__

you can use 【addon】 with【 target】 for more powerful usage。

```
puer -t http://localhost:8020 -a route.js
```
__[【check the  usage record 】](http://leeluolee.github.io/attach/2014-10/puer-step-4.gif)__


### use the builtin debugger (through weinre)

type `-i` to bootstrap the weinre, the client script is injected for you in every page through puer, click the 【nav to weinre terminal 】button or find the weinre server directly at 9001 port

```shell
puer -i
```
__[【check the  usage record 】](http://leeluolee.github.io/attach/2014-10/puer-step-5.gif)__

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
you must use puer middleware before route and static midleware(before any middle may return 'text/html')

###LICENSE
MIT
