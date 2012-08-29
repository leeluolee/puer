fs = require 'fs'
{print} = require 'sys'
{spawn, exec} = require 'child_process'

build = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false
  options = ['-c', '-b','-o', 'lib', 'src']
  options.unshift '-w' if watch

  coffee = spawn 'coffee', options
  coffee.stdout.on 'data', (data) -> print data.toString()
  coffee.stderr.on 'data', (data) -> print data.toString()
  coffee.on 'exit', (status) -> callback?() if status is 0

task 'docs', 'Generate annotated source code with Docco', ->
  fs.readdir 'src', (err, contents) ->
    files = ("src/#{file}" for file in contents when /\.coffee$/.test file)
    docco = spawn 'docco', files
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

# Todo : add support to gennerrate file
task 'gen', 'Generate some associated files when calls', (args)->
  console.log args
  options = ['-p']
  touch = spawn 'touch', files
  touch.stdout.on 'data', (data) -> print data.toString()
  touch.stderr.on 'data', (data) -> print data.toString()
  touch.on 'exit', (status) -> callback?() if status is 0

