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
    console.log option.reload, "reload"
  parser.on "--no-launch", "close the auto launch feature", () ->
    option.launch =false
    console.log option.launch, "launch"
  parser.on "-m --matches <regexp>", "some regexp to define your watching file \n\t\t\treg string should escape to convert to regexp,each reg joined by ','", (reg) ->
    option.matches = reg.split(",")
  parser.on "-e --excludes <regexp>", "excludes file under watching", (reg) ->
    option.excludes = reg.split(",")
  parser.on "-h --help", "help list" ,()->  
    option.help = true
    man = """\n
      Usage:\tpuer [options...]\n
      Options:
      #{parser.output()}  
    """
    console.log man
  # 传入从命令行提取的
  parser.run args
  puer(option) if not option.help
  


