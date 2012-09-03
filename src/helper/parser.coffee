class Parser
  constructor: () ->
    # ...
  on:(options,description,callback) ->
    if typeof description is "function"
      [description,callback]=["",description]
    @inspect(options)
  inspect: (options) ->
  
module.exports = Parser
  
