fs = require 'fs'
path = require 'path'
{print} = require 'sys'
{spawn, exec} = require 'child_process'

build = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false
  options = ['-c', '-b','-o', 'lib', 'src']
  options.unshift '-w' if watch
  coffee = exec "coffee #{options.join " "}", (err) ->
    console.log err if err?
  coffee.stdout.on 'data', (data) -> print data.toString()
  coffee.stderr.on 'data', (data) -> print data.toString()
  coffee.on 'exit', (status) -> callback?() if status is 0
  

task 'doc', 'Generate annotated source code with Docco', ()->
  docco = exec 'docco src/*.coffee', (err) ->
    throw err if err
  docco.stdout.on 'data', (data) -> print data.toString()
  docco.stderr.on 'data', (data) -> print data.toString()
  docco.on 'exit', (status) -> callback?() if status is 0

task 'build', 'Compile CoffeeScript source files', ->
  build()

task 'watch', 'Recompile CoffeeScript source files when modified', ->
  build true

task 'test', 'Run the test suite', ->
  build ->
    {reporters} = require 'nodeunit'
    process.chdir __dirname
    reporters.default.run ['test']
