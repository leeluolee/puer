# Option Parser 简陋版
lReg =/--([^-](?:\w|[^-=\<\>])+)(?:[\s=]\<([^\s]+)\>)?/#long flag or switch
sReg =/-((?:\w|[^-=\<\>]))(?:\s<([^\s]+)>)?/
clean = (str) ->
  str.trim().replace /\s{2,}/g, " "
  
class Parser extends (require "events").EventEmitter
  constructor: (config) ->

  option:(options,description,callback) ->
    if typeof description is "function"
      [description,callback]=["",description]
    @inspect(options)
  inspect: (options) ->
    cur = {}
    options = clean options
    parsed = sReg.exec options
    if parsed?
      options = options.replace(parsed[0],"").trim() if parsed?
      cur.long = parsed[1]
      cur.arg = parsed[2] if parsed[2]?
      console.log parsed, options
    if parsed?
      options = options.replace(parsed[0],"").trim() if parsed?
      cur.short = parsed[1]
      cur.arg = parsed[2] if parsed[2]?
    cur.type = if cur.arg? then "flag" else "switch"

  #opt = 
  #  long:xx
  #  arg:xx
  #  short:xx
  #  type:xx

  _trigger: (opt) ->
  
  run: (argv) ->
    argv.forEach (item) ->
      if /--([^-](?:\w|[^-=\<\>])+)/.exec item # is long options
        @_options.forEach 
    
    


parser = new Parser

module.exports = Parser
  
