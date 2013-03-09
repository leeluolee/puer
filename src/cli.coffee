sysPath = require "path"
puer = require "./index"
{Parser} = require "./helper"

pwd = process.cwd()


exports.run = (args) =>
  option = {}
  parser = new Parser()
  parser.on "-a --addon <file>", "your addon's path", (file) ->
    option.addon = sysPath.resolve pwd, file
  parser.on "-p --port <port>", "server's listen port, 8000 default", (port) ->
    option.port = parseInt(port) if port
  parser.on "-d --dir <dir>", "your customer working dir. default current dir ", (dir) ->
    option.dir = sysPath.resolve pwd, dir if dir
  parser.on "--no-reload", "close  auto-reload feature,(not recommended)", () ->
    option.reload =false
  parser.on "--no-launch", "close the auto launch feature", () ->
    option.launch =false
  parser.on "-i --ignored <regexp>", "ignored file under watching", (reg) ->
    ignored = reg.replace /^\/|\/$/g, ""
    option.ignored = new RegExp ignored
  parser.on "-t --time <ms>", "watching interval time (ms), default 500ms", (time) ->
    time = parseInt(time)
    option.interval = time if time > 10
  parser.on "-h --help", "help list" ,(haha)->  
    option.help = true
    man = """\n
      Usage:\tpuer [options...]\n
      Options:
      #{parser.output()}  
    """
    console.log man
  # 传入从命令行提取的
  parser.run args
  console.log("your option is", option)
  puer(option) if not option.help
  


