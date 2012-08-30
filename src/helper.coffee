fs = require "fs"

# utils 
pad = (num) ->
  if num<10 then "0"+num else num


module.exports =
  getLocalIP: () ->

  formatDate: (d) ->
    d = new Date parseInt date if typeOf(date) is not "date" 
    "#{d.getFullYear()}-#{pad d.getMonth()+1}-#{pad d.getDate()}  #{pad d.getHours()}:#{pad d.getMinutes()}:#{pad d.getSeconds()}"

  # direct send static resource if exisits
  send: (path, res, type = "text/html") ->
    res.setHeader "Content-Type", type
    stream = fs.createReadStream path, encoding : 'utf8'
    stream.pipe res

  typeOf : (obj) ->
    if obj is null or obj is undefined then String obj 
    else Object::toString.call(obj).slice 8, -1

  extend: (obj1, obj2, override) ->
    obj1[i] = item for i, item of obj2 when not obj1[i] or override
  
  
