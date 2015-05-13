

module.exports = {
  "POST /path/one": function( req, res ){
    res.send( req.query + "one" );
  }
}