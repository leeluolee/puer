var exec = require('child_process').exec;
var sysPath = require('path');
var fs = require("fs");


var mode =process.argv[2];
var sep = process.platform == "win32"? "\\" :"/";
var existsSync = fs.existsSync || sysPath.existsSync

// fix when install through npm install without -g and parent project has coffeescript dependency
var findCoffeeDir= function(pwd){
  if(!pwd) pwd = process.cwd()
  var index = pwd.length,coffee;
  do {
    pwd = pwd.slice(0,index)
    pwd = pwd.replace(" ", "\\ ")
    console.log(pwd)
    if(existsSync(coffee = sysPath.join(pwd,'node_modules', 'coffee-script', 'bin',"coffee"))){
      return coffee
    }
  }while((index=pwd.lastIndexOf(sep))>0)
  return coffee
}

if(mode == "test"){ // test mode
  var reporters = require("nodeunit").reporters;
  process.chdir(__dirname);
  reporters.default.run(["test"]);
}else{
  //default postInstall mode

  exec("node "+findCoffeeDir(__dirname)+" -o lib/ src/",function(err){
    if(err) throw err;
    console.log("build complete");
  })
}
