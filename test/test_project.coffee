fs = require 'fs'
path = require "path"
helper = require "../lib/helper"

console.log path.basename "/lib/config.ffee", ".coffee"

console.log helper.requireFolder path.join __dirname, "../lib/addons"

console.log process.cwd()
# console.log fs.statSync path.join __dirname, "../lib/stat"




