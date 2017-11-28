
var helper = require('./util/helper.js');
var pkg = require("../package.json");
var inquirer = require("inquirer");
var program = require('commander');
var puer = require('./index.js');
var chalk = require('chalk');
var path = require('path');
var cwd = process.cwd();
var fs = require('fs');


// puer logo
var logo = fs .readFileSync( 
  path.join(__dirname, './resource/template/logo.txt'), 'utf8'
).replace('{version}', pkg.version);

var convert = {
  'int': function(num){
    return parseInt(num, 10);
  },
  'regexp': function(str){
    return new RegExp(str.replace(/^\/|\/$/g, ''));
  }
}

program
  .option('-p, --port <port>', 'server port, default is 8000', convert.int)
  .option('-c, --config [path]', 'config file, avoid inputing option everytime, default is puerfile.js in pwd')
  .option('-r, --rules <glob>', 'filepath that containes rewrite rules')
  .option('-t, --target <url>', 'target proxy server, it is a shortcut for proxy rule')
  .option('-i, --inspect [port]', 'use weinre to inspect all puer page, default 9000')
  .option('-d, --dir [path]', 'working dir, default process.cwd()')
  .option('--file <glob>', 'file pattern for watching. use glob pattern')
  .option('--exclude <pattern>', 'use regexp to exclude file from watching', convert.regexp)
  .option('--views <path>', 'change the template\' folder, default is ./views')
  .option('--no-reload', 'stop livereload')
  .option('--no-launch', 'stop autolaunch page in browser')



var preHelp = program.outputHelp;

program.outputHelp = function(){
  console.log(logo)
  preHelp.apply(program, arguments);
}


program.parse(process.argv);

program.once('done', function(createFile){

  var options = {
    port: program.port,
    rules: program.rules,
    target: program.target,
    dir: program.dir,
    inspect: program.inspect,
    file: program.file,
    exclude: program.exclude,
    views: program.views,
    reload: program.reload,
    launch: program.launch,
    engine: program.engine
  }


  if(createFile){
    fs.writeFileSync(program.config, 'module.exports=' + JSON.stringify(options, null, 2));
  }
  options.config = program.config;
  puer(options);
  
})

// if config is passed in

var testfile = path.join( cwd, 'puerfile.js' );
if( program.config == undefined && fs.existsSync( testfile ) || program.config === true ){
  program.config = testfile;
}

if(program.config){
  // default puerfile is puerfile.js
  program.config = path.resolve( cwd, program.config);

  if(fs.existsSync(program.config)){
    try{

      var configOptions = require(program.config);
      helper.extend( program, configOptions );
    }catch(e){

      helper.log('Some Error occurs in ' + program.config + '\n' + e.message, 'error')
      process.exit(1); 
    }

    process.chdir(path.dirname(program.config))

    program.emit('done')
  }else{

    helper.log( program.config + ' is not exsits. \n', 'warn')
    inquirer.prompt([{
      type: 'confirm',
      name: 'create',
      message: 'Should I create '+ chalk.underline(program.config) + ' at current dir for you to store passed options?'
    }], function(answser){

      program.emit('done', answser.create)

    })

  }
}else{

  program.emit('done')
}




