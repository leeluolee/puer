module.exports = function( app, options ){
  app.get('db');
  app.set('db', databases);
}


module.exports = function(req, res, next){
  var databases = this.get('db');
}





