fs =require "fs"
# direct send static resource if exisits
send = (path, res, type = "text/html") ->
  res.setHeader "Content-Type", type
  stream = fs.createReadStream path, encoding : 'utf8'
  stream.pipe res

module.exports = 
  html: require "./html"
  markdown: require "./markdown"