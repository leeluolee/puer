var helper = require('../../src/util/helper.js');
var fs = require('fs')
var path = require('path')
// Very slow but file's content will always be 10000
var time = 5000;
pre = +new Date
// for (var i = 0; i <= 5000; i++) {
//   fs.writeFileSync('file.txt', i)
// }

console.log(( now = +new Date) - pre)

// Very fast but file's content may be 5896, 2563, 9856, ...
var k =0,er=0;
for (var i = 0; i <= 5000; i++) {

  // fs.writeFile('file5.txt', i, function(i,err) {
  //   if(err) throw err
  //     if(k++ >= 5000 ) console.log(+new Date - now)
  // }.bind(this, i))

}
// Very fast but file's content may be 5896, 2563, 9856, ...
var j =0,er2=0;
for (var i = 0; i <= 500000; i++) {

  helper.saveFile('file5.txt', i) 
}

// var j =0;
// for (var i = 0; i <= 500; i++) {

//   if(i % 10){
//     fs.writeFile('file3.txt', i, function(err) {
//       if(err) console.log( err )
//     })
//   }else{
//     setImmediate(function(i){
//       fs.writeFile('file3.txt', i, function(err) {
//         if(err){ console.log(err, i) }
//         if(j++ >= 5000 ) console.log(+new Date - now)
//       })
//     }.bind(this, i))
//   }

// }

