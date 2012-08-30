fs = require "fs"
{EventEmitter} = require "events"

multiSwitches = /^-(\w{2,})$/ # multiply switches 
unicode = "(?:[\\w\\u00a1-\\uFFFF-])"
typeOf = (obj) ->
  if obj is null or obj is undefined then String obj 
  else Object::toString.call(obj).slice 8, -1



class Command
  constructor: (name, flags, switchs, args) ->



class OptParser extends EventEmitter
  constructor: (opts = {}) ->
    opts = JSON.parse fs.readFileSync opts if typeof opts is "string" 
    @on opts if opts?
  config: (opts) ->
  options: (opts..., callback) ->
    # ...
  parse: (argv) ->
    # ...
  action: () ->
  
  run:(argv) ->


module.exports = (opts) ->
  new OptParser opts

  
