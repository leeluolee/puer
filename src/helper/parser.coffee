# Option Parser 简陋版
lReg =/--([^-][-\w]+)/#long flag or switch
sReg =/-((?:\w|[^-=\<\>]))(?:\s<([^\s]+)>)?/
argReg = ///
  --([^-](?:\w|[^-=\<\>])+)(?:[\s=]\<([^\s]+)\>)?
///

clean = (str) ->
  str.trim().replace /\s{2,}/g, " "
  
class Parser
  constructor: (config) ->
    @options = []

  on:(options,description,callback) ->
    if typeof description is "function"
      [description,callback]=["",description]
    opt = @inspect(options)
    opt.description = description
    opt.callback = callback
    @options.push opt

  inspect: (options) ->
    cur = {}
    options = clean options
    parsed = lReg.exec options
    if parsed?
      options = options.replace(parsed[0],"").trim()
      cur.long = parsed[1]
      cur.arg = parsed[2] if parsed[2]?
    parsed = sReg.exec options
    if parsed?
      cur.short = parsed[1]
      cur.arg = parsed[2] if parsed[2]?
    # 有参数的option 为 flag 无参数的 为 switch
    cur.type = if cur.arg? then "flag" else "switch"
    cur

  trigger: (opt, arg) ->
    opt.callback?(arg)
    opt.callback=null
  
  run: (argv) ->
    argv = @_preArgv argv
    for option in @options
      for item,index in argv
        if item.long is option.long and option.long?
          @trigger(option, item.arg)
        else if item.short is option.short and option.short? 
          @trigger(option, item.arg)
          continue

  output:()->
    result = []
    @options.forEach (opt) ->
      sep = ""
      sep += if opt.short then "  -#{opt.short}," else "     " #short
      sep += if opt.long then "--#{opt.long}#{if opt.arg then "<"+opt.arg+">" else "   "}\t" else "  \t"
      sep += (opt.description or "")+"\n"
      result.push(sep)
    result.join("")

  _preArgv: (argv) ->
    option = argv.join " "
    option = option.replace /(?:\s)-(\w{2,})/g, (a,b,c) -> 
      char = []
      for num in [0...b.length]
        char.push " -#{b[num]}"
      return char.join " " 
    option = option.replace /\=/g," "
    result = []
    option.replace /--([^-][\w-]*)(\s[^\s-]+)?|-\w(\s[^\s-]+)?/g, (a) ->
      # 第一个是flag 第二个是参数
      cur = {}
      seps = a.split(/\s+/)
      if ~seps[0].indexOf("--") 
        cur.long = seps[0].slice(2) 
      else cur.short = seps[0].slice(1)
      cur.arg = seps[1]
      result.push(cur)
      ""
    result


module.exports = Parser
