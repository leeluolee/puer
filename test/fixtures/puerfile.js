var ftl = require('express-freemarker')

module.exports={
  "engine": {
    "ftl": ftl() 
  },
  "rules": "mock_*.js",
  "reload": true,
  "views": "view",
  "launch": true,
  "throttle": 10 // kb
}



