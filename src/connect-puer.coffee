# 职责是
# 1. 插入script节点
# 2. 读取参数ignored,
# 3. 读取/reload---uid.js 等信息 ,并及时反馈

path = require 'path'

# local module
chokidar = require 'chokidar'
express = require 'express'
helper = require "./helper"


uid = do () ->
  _id = 1
  -> _id++

# connect middleware
# =====================================
# middleware options:
#
#   * interval: watcher interval
#   * dir: watcher dir (defaults process.cwd())
#   * ignored: ignored file regexp

module.exports = (app, options) ->
  app.use express.static path.join __dirname, "../vendor" 
  options.ignored ?= /(\/|^)\..*|node_modules/

  if(!options.dir) 
    throw Error("dir option is need to watch")


  resCache = []
  max = 100
  
  watcher = chokidar.watch options.dir, 
    ignored: options.ignored
    persistent: true
    interval: options.interval

  helper.log "watcher on!!"
  watcher.on 'change', (path, stats) ->
    # helper.log "fileChange #{path}"
    resCache.forEach (res) ->
      res.emit "changeFile", path:path
    
  
  # cache response to emit change event outer closure
  app.use "/puer_server_send", (req, res, next) ->
    #
    req.socket.setTimeout Infinity
    #不能保存过度的长连接

    if resCache.length >= max
      resCache.shift()
      helper.log "resCache.length is more than #{max}, shift the first one", "warn"
    resCache.push res
    # helper.log "sse connect resCache.length is #{resCache.length}"
    res.sse = (infos) ->
      infos.event or= "update"
      res.write "\n"
      res.write "id: #{uid()}\n" 

      for own key, value of infos 
        res.write "#{key}: #{value}\n"
      res.write "\n" 

    res.on "changeFile", (data) ->
      path = data.path
      stats = data.stats
      isCss = ~path.indexOf ".css"
      infos = data: "#{path}"
      infos.event = "css" if isCss
      res.sse infos
    
    

    

    # long-live request
    # send headers for event-stream connection
    res.writeHead 200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
    res.write '\n'


    req.on "close", ->
      index = resCache.indexOf(res)
      if ~index
        resCache.splice(index, 1)
        # helper.log("close req event-stream resCache.length is #{resCache.length}", "warn")

  (req, res, next) ->
    write = res.write
    end = res.end
    
    # proxy
    res.write = (chunk, encoding) ->
      header = res.getHeader "content-type"
      length = res.getHeader "content-length"
      if (/^text\/html/.test header) or not header
        if Buffer.isBuffer(chunk)
          chunk = chunk.toString("utf8")
        return write.call res, chunk, "utf8" if not ~chunk.indexOf("</head>") 
        chunk = chunk.replace "</head>", "<script src='/js/reload.js'></script></head>"
        # need set length 
        if length
          length = parseInt(length)
          length += (Buffer.byteLength "<script src='/js/reload.js'>")
          res.setHeader "content-length", length

        write.call res, chunk, "utf8"
      else 
        write.call res, chunk, encoding

    res.end = (chunk, encoding) ->
      this.write chunk, encoding if chunk?
      end.call(res)

     
     

    do next


