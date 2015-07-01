// DI 非常适合于 puer, 既然你想避免手动的书写脚本. 
// XDE



module.exports = {
  "POST /path/to": function( req, res, next ,$proxy ){
    res.send(JSON.stringify(req.body, null ,2));
  },
  "ALL /posts": function( req, res ){
    posts.push({id:posts.length, name: 'post' + posts.length});
    var json = JSON.stringify(posts, null, 2);

    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    
    writer.write(json);
    res.send(json);
  },
  "GET /html/(.*).html": function(req, res, next, $proxy){
    res.proxy( 'http://nev.netease.com' , function(err, content){
      console.log(content)
    });
  },
  "GET /get/page": function(req, res, next){
    res.send({
      code: 200,
      left: 20
    })
  },
  'GET /get/posts': ['getxxxa', function(req, res, next){

  }],
  'GET /homepage': "./view/static.html",
  'GET /api/(.*)': "get/{0}.json",
  'POST /api/(.*)': "post/{0}.json",
  "GET /raw": {code: 100, result: 200},
  'GET /': function(req, res){
    res.render('index.vm', {
      hello: {
        world: 'HZzhenghaibo郑海波哈'
      }
    })
  },  
  'GET /ftl': function(req, res){
    res.render('view/index.ftl', {
      name: 'zhenghaibo',
      flowers: [
        ["zhenghaibo", 'hello' ,100],
        ["zhenghaibo2", 'hello2' ,200]
      ]
    })
  },
  'ALL /p/(.*)': 'http://nec.netease.com/plugin/{0}',
  "GET /blog": "./index.html",
  "GET /(framework|standard|library)": {
    handle: function(req, res, next){
      res.proxy('http://localhost:8000/get/page')
    },
    transform: function(buffer){
      var buffer = JSON.parse(buffer.toString())
      // console.log(buffer.toString('utf8'), buffer.length)
      buffer.code =304; 
      console.log(buffer)
      return JSON.stringify(buffer, 'utf8');
    }

  }
}







