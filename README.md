



> __Puer - more than a live-reload server , built for efficient frontend development__

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/leeluolee/puer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[中文指南](http://leeluolee.github.io/2014/10/24/use-puer-helpus-developer-frontend/)


##Features


1. __create static server__ at target dir (default in current dir)
2. __auto reload__ : editing css will update styles only, other files will reload the whole page.
3. __weinre integrated__  use `-i` options
4. __proxy server mode__, use it with an existing server
5. __http request mock__ by `-a` addon，the addon is also __live reloaded__
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

puer will launch the browser for you. all pages will reload when you edit them

### __full options__

To list all of puer's options use `puer -h`

```bash
ubuntu-21:19 ~ $ puer -h

Usage:  puer [options...]

Options:
  -p,--port <port>  server's listen port, 8000 default
  -f,--filetype <typelist>  fileType to watch(split with '|'), default 'js|css|html|xhtml'
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

During development，you may need to mock a request . use `-a <addon>` to help you mock a dynamic api

```shell
puer -a route.js
```

a sample `route.js` looks like:

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


__[【check the  usage record 】](http://leeluolee.github.io/attach/2014-10/puer-step-2.gif)__

It is just a  config for routers, you need export an [Object] containing router config. The keys join with 【METHOD】 and 【PATH】, and the  values represent the callback。This function is based on [express](http://expressjs.com)'s router, you can check its documentation for more help。

example from above is just equal code in express like:

```javascript
app.get("/v1/posts/:id", function(req, res, next){
  // response json format
  res.send({
    title: "title changed",
    content: "tow post hahahah"
  })
})

app.put("/v1/posts/:id", function(){})
app.post("/v1/posts", function(){})
app.delete("/v1/posts/:id", function(){})
```


Once `route.js` is changed, puer will refresh it. There is no need to restart puer.


__the route.js style__

__Function __ : just like showed before, you can use the express's Response and Request Method

__String__: if the passin is a [String], puer will find the File first, if file is not exsit, will directly response with the origin [String]

```javascript
{
  "GET /v1/posts/:id": "hello.html" 
}
```

__Object | Array__: will respone a json format. 

```javascript
  
  {
    "GET /v1/posts/:id": {message: "some message"}
    "GET /v1/posts": [{message: "some message"}]
  }

```


###__proxy support__

you can use `-t` or `--target` to use puer with an exsiting server. For example, say you already have a server running at port 8020. 

```javascript
puer -t http://localhost:8020
```

__[【check the record for proxy mode】](http://leeluolee.github.io/attach/2014-10/puer-step-3.gif)__

You can use 【addon】 with【 target】 for more powerful usage。

```
puer -t http://localhost:8020 -a route.js
```
__[【check the  usage record 】](http://leeluolee.github.io/attach/2014-10/puer-step-4.gif)__


### use the builtin debugger (through weinre)

type `-i` to bootstrap the weinre, the client script is injected for you in every page through puer, click the 【nav to weinre terminal 】button or find the weinre server directly at port 9001

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
You must use puer middleware before route and static middleware(before any middle may return 'text/html')


### Other

<a name="client-event"></a>
#### client event

puer will inject a namespace __`puer` in global__. it is a Emitter instance. has `on`, `off` and  `emit`.

you can register `update` event to control the reload logic


```javascript

puer.on("update", function(ev){
  console.log(ev.path) // the absolute path , the file change
  console.log(ev.css) // whether css file is change
  if(ev.path.match(/\.js$/)){
    ev.stop = true; // if you set ev.stop = true.  the reload will be stoped;
  }
 
})

```

Example above means that: if js file is changed,  reloading won't be actived.



###LICENSE
MIT
