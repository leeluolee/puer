// http://expressjs.com/advanced/developing-template-engines.html


var vm = require("../../src/render/velocity.js");

module.exports = {
  port: 80,
  // proxy: "http://192.168.1.1",
  proxy: null,
  inspect: null,
  // inspect: 8001 or true (default is 9001)
  "static": "./" ,
  livereload: true,
  livereload: {
    file: '(js|css|html)',
    exclude: 'node_modules'
  },
  engine: null,
  // engine: {
  //   vm: vm({root: path.join(__dirname, "view")})
  // },
  view： "./view",
  // null
  routes: null,
  // routes: {
  //   "GET /homepage": function(req, res, next){
  //     res.render( "index.vm", { content: 1 } );
  //   },
  //   "GET /api/blog/:id": function(){
  //     return {
  //       code: 1,
  //       result: 200
  //     }
  //   },
  //   "GET /api/blog": {
  //     code: 300,
  //     result: "直接返回"
  //   },
  //   // render
  //   "GET /api": "./view/static.html",
  //   "(.*)": "http://192.168.1.1",
  //   "/api/v1/(.*)": "http://nec.netease.com",
  //   "/api/v2/(.*)": "http://nej.netease.com",
  //   "/api/home(.*)": "https://nec.netease.com"
  // }
}



