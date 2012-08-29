var exec = require('child_process').exec;
var sysPath = require('path');
var mode =process.argv[2];
if(mode == "test"){ // test mode
  var reporters = require("nodeunit").reporters;
  process.chdir(__dirname);
  reporters.default.run(["test"]);
}else{
  //default postInstall mode
  exec("node "+sysPath.join('node_modules', 'coffee-script', 'bin', 'coffee')+" -o lib/ src/",function(err){
    if(err) throw err;
    console.log("build complete");
  })
}
