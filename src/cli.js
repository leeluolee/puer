var pkg = require("../package.json");
var program = require('commander');

program
  .version(pkg.version)
  .option('-p, --port', 'server\'s port, default is 8000')
  .option('-t, --target', 'target proxy server')
  .option('-f, --file', 'file pattern. use glob')
  .option('-c, --config', 'puer\'s config file, default is puerfile.js')
  .option('-s, --static [type]', 'Add the specified type of cheese [marble]', 'marble')
  .option('--exclude', 'file pattern. use regexp to exclude file')
  .option('--no-reload', 'stop livereload')
  .option('--no-liveroute', 'stop watch config change')
  .option('--no-ui', 'stop the default ui')
  .parse(process.argv);



console.log(program)