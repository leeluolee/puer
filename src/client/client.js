var io = require("socket.io-client");


var extend = function(o1, o2, override){
  for(var i in o2) if(override || o1[i] === undefined){
    o1[i] = o2[i]
  }
  return o1;
}


var emitable = (function(){
  var API = {
    once: function(event, fn){
      var callback = function(){
        fn.apply(this, arguments)
        this.off(event, callback)
      }
      return this.on(event, callback)
    },
    on: function(event, fn) {
      if(typeof event === 'object'){
        for (var i in event) {
          this.on(i, event[i]);
        }
      }else{
        var handles = this._handles || (this._handles = {}),
          calls = handles[event] || (handles[event] = []);
        calls.push(fn);
      }
      return this;
    },
    off: function(event, fn) {
      if(!event || !this._handles) this._handles = {};
      if(!this._handles) return;

      var handles = this._handles , calls;

      if (calls = handles[event]) {
        if (!fn) {
          handles[event] = [];
          return this;
        }
        for (var i = 0, len = calls.length; i < len; i++) {
          if (fn === calls[i]) {
            calls.splice(i, 1);
            return this;
          }
        }
      }
      return this;
    },
    emit: function(event){
      var args = [].slice.call(arguments, 1),
        handles = this._handles, calls;

      if (!handles || !(calls = handles[event])) return this;
      for (var i = 0, len = calls.length; i < len; i++) {
        calls[i].apply(this, args)
      }
      return this;
    }
  }
  return function(obj){
      obj = typeof obj == "function" ? obj.prototype : obj;
      return extend(obj, API)
  }
})();


function addListener(el, type, cb) {
    if (el.addEventListener) return el.addEventListener(type, cb, false)
    else if (el.attachEvent) return el.attachEvent("on" + type, cb);
}

var puer = emitable({});
// autoreload
var autoreload=function(){
  var location = window.location,
      origin = location.protocol+"//"+location.host;

  var socket = io.connect(origin); 

  var stylesheets = document.getElementsByTagName("link");

  var cacheBuster = function(url){
      var date = Math.round(+new Date/1000).toString();
      url = url.replace(/(\\&|\\\\?)cacheBuster=\\d*/, '');
      return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };
  var updateStyle = function(stylePathName){
    for(var i = stylesheets.length;i--;){
      var href = stylesheets[i].getAttribute("href");
      stylesheets[i].setAttribute("href",cacheBuster(stylesheets[i].getAttribute("href")));
    }
    return true;
  }
  
  socket.on('update', function(data){
    var evt = {path: data.path, css: !!data.css, stop: false}
    puer.emit("update", evt);
    if(data.css && updateStyle(data.css)) return true;
    if(!evt.stop){
      window.location.reload();     
    }
  })
}

addListener(window, 'load', autoreload)


module.exports = puer;
