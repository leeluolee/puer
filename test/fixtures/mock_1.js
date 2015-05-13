
module.exports = {
  "GET /path/to": function( req, res ){
    console.log(req.body)
    console.log(req.url)
    res.send( req.query );
  },
  d: function(){ }
}