module.exports = {
  "GET /home2/**": "fixtures/index.html",
  "GET /testarray": [{array:1}],
  "GET /testobject": {object:1},
  "GET /home/code/:id": function(req, res, next){

  },
  "POST /home/code/:id": function(){
  },
  "/test/:id/home": function(req, res, next){
    res.send("hleeluaildd")
  },

}


