fs = require 'fs'
path = require "path"
{Parser,merge} = require "../lib/helper"

parser = new Parser("a simple but extensible static server")

# # flag
# parser.on "-a,--addon <file>","custom addon-file,see the example in src/addon/* folder", (file) ->
#   console.log(file)
# # switch
# parser.on "--no-autoreload","prevent the autoreload",(bool) ->
#   console.log bool
# # argument

