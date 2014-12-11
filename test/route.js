module.exports = {
  "GET /home2/**": "fixtures/index.html",
  "GET /home/code/:id": function(req, res, next){

  },
  "POST /home/code/:id": function(){
  },
  "/test/:id/home": function(req, res, next){
    res.send("hleeluaildd")
  },

}


