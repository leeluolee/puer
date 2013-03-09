var autoreload=function(){

      var source = new EventSource('/puer_server_send');


      source.addEventListener('update', function(e) {
        console.log(e.data);
        setTimeout(function(){
          window.location.reload()
        },Math.random()*100)
      }, false);
      source.addEventListener('css', function(e) {
        updateStyle()
      }, false);

      source.addEventListener('open', function(e) {
        console.log(e, 'open');
      }, false);
      source.addEventListener('error', function(e) {
        console.log(e);
      }, false);

      var location = window.location,
          origin = location.protocol+"//"+location.host;
      var stylesheets = document.getElementsByTagName("link");
      var cacheBuster = function(url){
          var date = Math.round(+new Date/1000).toString();
          url = url.replace(/(\\&|\\\\?)cacheBuster=\\d*/, '');
          return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
      };
      var updateStyle = function(){
        for(var i = stylesheets.length;i--;){
          var href = stylesheets[i].getAttribute("href");
          stylesheets[i].setAttribute("href",cacheBuster(stylesheets[i].getAttribute("href")));
        }
        return true;
      }
      // socket.on('update', function(data){
      //   if(data.css && updateStyle(data.css)) return true;
      //   window.location.reload();     
      // })
    }

window.addEventListener("load",autoreload,false);
