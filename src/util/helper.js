
var isWin = process.platform === 'win32';
var exec = require('child_process').exec;
var chalk = require('chalk');
var os = require('os');
var qrcode = require('qrcode-npm');




var helper = module.exports = {
  // watch single file's modify
  watchFile: function( filename, callback ){
    if (isWin) {

      return fs.watch( filename, function(event) {
        if (event === 'change') {
          return callback(filename);
        }
      });
    } else {

      return fs.watchFile(filename, { interval: 200 }, function(curr, prev) {

        if (curr.mtime > prev.mtime) {
          return callback(filename);
        }
      });
    }
  },
  extend: function( o1, o2 , override ){
    if (!o2) return o1;
    for( var i in o2 ) if( override || o1[i] == undefined){
      o1[i] = o2[i]
    }
    return o1;
  },
  // get param from reg2path
  getParam: function(reg, path){

    var ret = reg.exec(path);
    if( !ret ) return false;

    var keys = reg.keys || [];
    var params = {};
    keys.forEach(function( key, index ){
      params[key.name] = ret[index + 1]
    })
    return params;
  },
  encode: function(path, params){
    params = params || {};
    return path.replace(/\$\{(\w*)?\}/g, function(all, name){
      return params[name];
    })
  },
  openBrowser: function(target, callback) {
    var map, opener;
    map = {
      'darwin': 'open',
      'win32': 'start '
    };
    opener = map[process.platform] || 'xdg-open';
    return exec("" + opener + " " + target, callback);
  },
  getIPs: function(){
    var ifaces = os.networkInterfaces();
    var ips = [];
    for ( var dev in ifaces) {
      ifaces[dev].forEach( function( details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          return ips.push( details.address )
        }
      })
    }
    return ips;
  },

  getQRCode: function(content, start){
    var qr;
    if (start == null)  start = 2; 
    try {
      qr = qrcode.qrcode(start, 'L');
      qr.addData(content || '');
      qr.make();
      return qr;
    } catch (err) {
      if (start > 8) {
        throw err;
      } else {
        return helper.getQRCode(content, start + 2);
      }
    }
  },

  // express only
  getFullUrl: function(req){
    
    return req.protocol + '://' + req.get('host') + req.originalUrl;
  },

  log: function(message, label){
    var labelColor = {
      info: 'Cyan',
      error: 'Red',
      warn: 'Yellow',
      success: 'Green'

    }
    label = label || 'info';

    var color = labelColor[label];
    if( !color ) color = 'Cyan';

    console.log( chalk.white['bg' + color]( helper.expand(label, 11)), message );
  },
  expand: function( str, width){
    var blank = width - str.length;
    if(blank < 0) return str;
    var left = Math.ceil(blank / 2);
    var right = Math.floor(blank / 2);
    return new Array(left).join(' ') + str + new Array(right).join(' ');
  }
  
}