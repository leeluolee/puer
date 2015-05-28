// a resource is represent 
var saveFile = require('save-file');

// filename should be a absolute
function Resource(){
  this.store = store || {};
}

var ro = Resource.prototype;

ro.sync = function(){
  try{
    var source = JSON.stringify(this.json);
    saveFile(filename, source);
  }catch(e){

  }
}

ro.add = sync(function(){

})

ro.del = sync(function(){

})


ro.update = sync(function(){

})


function sync(fn){
  return function(){
    fn.apply(this, arguments);
    this.sync();
  }
}
