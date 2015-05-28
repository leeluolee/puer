
module.exports = {
  "POST /path/to": function( req, res ){
    res.send( req.query );
  },
  'ALL /d/(.*)': './{0}.html',
  "GET /raw": {code: 100, result: 200},
  'GET /': function(req, res){
    res.render('index.vm', {
      hello: {
        world: 'HZzhenghaibo郑海波哈'
      }
    })
  },
  'GET /ftl': function(req, res){
    res.render('index.ftl', {
      name: 'zhenghaibo',
      flowers: [
        ["zhenghaibo", 'hello' ,100],
        ["zhenghaibo2", 'hello2' ,200]
      ]
    })
  },
  'ALL /q/:id': 'http://segmentfault.com/',
  'ALL /(pub|img)/(.*)': 'http://nec.netease.com',
  'ALL /p/(.*)': 'http://nec.netease.com/plugin/{0}',
  'ALL (.*)': 'http://nec.netease.com/plugin/{0}',
  "/blog/get": "xxx.html"
}