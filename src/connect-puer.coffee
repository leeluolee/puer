
path = require 'path'

# local module
chokidar = require 'chokidar'
express = require 'express'
helper = require "./helper"

cwd = do process.cwd


# connect middleware
# =====================================
# middleware options:
#
#   * dir: watcher dir (defaults process.cwd())
#   * filetype: watched fileType(defaults 'js|css|html|xhtml')

module.exports = (app, server, options) ->
  app.use '/puer', express.static path.join __dirname, "../vendor" 

  options.filetype ?= 'js|css|html|xhtml'
  options.reload ?= true
  options.inject ?= []
  options.ignored ?= /node_modules/

  noop = ->



  filetype = options.filetype.split('|')

  if(!options.dir) 
    throw Error("dir option is need to watch")
  if(options.reload)
    options.inject.push '<script src="/puer/js/reload.js"></script>'
    watcher = chokidar.watch options.dir, 
      ignored: (filename)-> 
        # first detect the ignored list
        if options.ignored.test(filename)
          return true
        else
          matched= /\.(\w+)$/.exec(filename)
          if matched
            ext = matched[1]
            return filetype.indexOf(ext) == -1
          else 
            return false
      persistent: true

    helper.log "watcher on!!"

    io = (require 'socket.io').listen server
    io.set("log level", 1)

    # keep the connect socket instance
    sockets = []
    # bind one listener to avoid memory leak

    watcher.on 'change', (path, stats) ->
      data = "path": path
      # if css file modified   dont't reload page just update the link.href
      data.css = path.slice cwd.length if ~path.indexOf ".css"

      for socket in sockets
        socket.emit "update", data if socket

      # helper.log "fileChange #{path}"
    io.sockets.on "connection" , (socket) ->
      # console.log("connection")
      sockets.push socket
      socket.on 'disconnect', ->
        index = sockets.indexOf socket
        if index != -1
          sockets.splice index, 1



  (req, res, next) ->
    # proxy
    write = res.write
    end = res.end
    # use res.noinject to forbit relad or weinre inject
    # if res.noinject != true

    res.flush = noop

    # req.on 'close', ->         
    #   res.write = res.end = (->)

      
    res.chunks = '';
    # res.on "pipe", (data) -> res.setHeader("content-type", 100)
    # res.on "pipe", (resp) -> 
    #   resp.on "data", (data)-> 
    #     res.chunks+=data.toString('utf8') 
    #   resp.on "end", (data)-> 
    #     res.end(res.chunks, 'utf8');
    #     res.chunks = "";

    # res.on "pipe", (k)->
    #   # res.setHeader("content-Length", 20)
    #   k.on "data", (data)-> 
    #     console.log(data.toString("utf8"))
    #     # res.setHeader "Content-Length", 100
    #     write.call(res,data, 'utf8')


    res.write = (chunk, encoding) ->

      header = res.getHeader "content-type"
      length = res.getHeader "content-length"
      # res.removeHeader "Content-Length"


      if (/^text\/html/.test header) or not header
        if Buffer.isBuffer(chunk)
          chunk = chunk.toString("utf8")

        if not ~chunk.indexOf("</head>") 
          return write.call res, chunk, "utf8" 
        chunk = chunk.replace "</head>", options.inject.join('') + "</head>"


        # need set length 
        if length
          length = parseInt(length)
          length += Buffer.byteLength options.inject.join('')
          try
            res._header = null;
            res.setHeader "content-Length", length
            this._implicitHeader();
          catch e

        return write.call res, chunk, "utf8"
      else 
        return write.call res, chunk, encoding

    res.end = (chunk, encoding) ->
      this.write chunk, encoding if chunk?
      return end.call(res)

    do next


