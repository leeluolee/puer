# project = require "../lib"

sysFs = require 'fs'
path = require 'path'
{file,colorify,logger,util} = require "../lib/helper"
mkdirp = require 'mkdirp'
{wrap} = require "../lib"

# logger.error "error"
# logger.info "info"
# logger.debug "debug"
# logger.done "done"
# logger.warn "warn"

# file.writeFile "/home/tmp_zhenghaibo.txt","hahaha2", (err) ->
#   logger.error err if err?



printColor = ->
  result = ""
  for i in [0,1,4,5,9]
    result += "==style==\n"
    for j in [30..37].concat [90..97]
      result += "=fore=\t"
      for k in [40..47].concat [100..107]
        result += colorify "style:#{i}-fore:#{j}-back:#{k}", j, k, i
  console.log result

# do printColor




module.exports =
  "true is ok": (test) ->
    test.ok true
    test.done()
  "unlink should delete the file" : (test) ->
      test.done()

  "helper getLocalIP will get the local outer" : (test) ->
    console.log util.getLocalIP()
    test.done()
  
  



  
    
    
    
