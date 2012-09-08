fs = require "fs"
sysPath = require "path"

# utils 
pad = (num) ->
  if num<10 then "0"+num else num
  

extendOne = (obj, index ,item)->
  obj[index] = item if not obj[index]?
  # ...
distinct = (array) ->
  arr = array.slice(0).sort()
  arr.sort (a, b) ->
    if a is b 
      n = arr.indexOf a  
      array.splice n, 1
  array


module.exports = util =
  # formatting date
  formatDate: (d) ->
    d = new Date parseInt date unless typeOf(date) is "date" 
    "#{d.getFullYear()}-#{pad d.getMonth()+1}-#{pad d.getDate()}  #{pad d.getHours()}:#{pad d.getMinutes()}:#{pad d.getSeconds()}"

  # direct send static resource if exisits
  send: (path, res, type = "text/html") ->
    res.setHeader "Content-Type", type
    stream = fs.createReadStream path, encoding : 'utf8'
    stream.pipe res

  # credible type , no dom related version
  typeOf : (obj) ->
    if obj is null or obj is undefined then String obj 
    else Object::toString.call(obj).slice(8, -1).toLowerCase()
  # simple extend   
  extend: (obj1, obj2, callback = extendOne) ->
    callback obj1, i, item for i, item of obj2 

  # used in options merge
  merge: (obj1, obj2)->
    util.extend obj1, obj2, (obj1, i, item) ->
      switch util.typeOf item
        when "array"
          if util.typeOf(obj1[i]) is "array" then obj1[i] = distinct obj1[i].concat item
          else obj1[i] = item
        when "object"
          if util.typeOf(obj1[i]) is "object" then util.extend obj1[i], item
          else obj1[i] = item
        else 
          obj1[i] = item if not obj1[i]?
    return obj1

  # just for deletting the addons's configure file
  requireFolder: (dir) ->
    files = fs.readdirSync dir
    $exports = {}

    files.forEach (file, index) ->
      unless sysPath.extname(file) is ".js" then return
      base = sysPath.basename file, ".js"
      $exports[base] = require sysPath.join dir, file
    $exports

    
    

    
    
  
  
  
