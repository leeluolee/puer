!function(global){
  var uid =0,
    sid = "__storage_"+ new Date().toString(36) + uid++,
    keySep = /\./g;

  var typeOf = function(o){
    return o == null /*means null or undefined*/
    ? String(o) : Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  }
  var extend = function(o1, o2, override){
    for(var i in o2){
      if(!o1[i] || override){
        o1[i] = o2[i];
      }
    }
  }

  function  namespace(base,ns,get){
    var keys = ns,
      cur = base;
    if(!ns||!ns.length||ns=="") return base;
    for(var i = 0,len = keys.length;i < len;i++){
      var key = keys[i];
      if(!cur[key] || typeOf(cur[key]) !=='object'){
        if(get) throw 'not a valid namespace'
        else {
          cur[key] = {};
        }
      } 
      cur = cur[key];
    }
    return cur;
  }

  function storageOf(storage) {
    return {
      storage:storage,
      // key    name1.name2.name3.... etc
      setItem:function(key,value){
        key = String(key).trim();
        var type = typeOf(value);

        if(!~key.indexOf(".")){
          storage.setItem(key,JSON.stringify(value))
          return this;
        }
        var keys = key.split(keySep),
          first = keys.shift(),
          last = keys.pop(),
          root = JSON.parse(storage.getItem(first)||"{}"),
          root = typeOf(root)!=="object"?{}:root;
          lastNS = namespace(root,keys,false);

        lastNS[last] = value;
        storage.setItem(first, JSON.stringify(root));
        return this;

      },
      getItem:function(key){
        key = String(key).trim();
        if(!~key.indexOf(".")){
          return JSON.parse(storage.getItem(key));
        }
        var keys = key.split(keySep),
          first = keys.shift(),
          last = keys.pop();
        return namespace(JSON.parse(storage.getItem(first)),keys,true)[last] 

      },
      removeItem:function(key){
        key = String(key).trim();
        if(!~key.indexOf(".")){
          return storage.removeItem(key);
        }
        var keys = key.split(keySep),
          first = keys.shift(),
          last = keys.pop(),
          root = JSON.parse(storage.getItem(first)||"{}"),
          lastNS = namespace(root,keys,false);
        delete lastNS[last];
        storage.setItem(first, JSON.stringify(root));
        return this;
      },
      key:function(index){
        return storage.key(index);
      },
      clear:function() {
        return storage.clear();
      }
    
    };
  }

extend(window,{
  extend:extend,
  storageOf:storageOf
});

}(window)


// Demo 
;(function(win){
  var $ = function(selector) {return document.querySelector(selector)};
  var StorageDemo = function(){
    this.container = $("#container");
    this.localList = $("#local ul");
    this.sessionList = $("#session ul");

    // 每次刷新 update list
    this.list()
    this.initEvent()
  }
  extend(StorageDemo.prototype,{
    listLocal:function(){
      var text ="";
      for(var i in localStorage){
        var item = localStorage[i];
        if(!~i.indexOf('_')){
          text += "<li>"
          text+="<span class='key'>"+i+":&nbsp;</span><span class='value'>" + item + "</span>"
          text += "</li>"
        }
      }
      this.localList.innerHTML = text;
    },
    listSession:function(){
      var text ="";
      for(var i in sessionStorage){
        var item = sessionStorage[i];
        if(!~i.indexOf('_')){
          text += "<li>"
          text+="<span class='key'>"+i+":&nbsp;</span><span class='value'>" + item + "</span>"
          text += "</li>"
        }
      }
      this.sessionList.innerHTML = text;
    },
    list:function(){
      this.listLocal();
      this.listSession();
    },
    initEvent:function(){
      $('#container').addEventListener("click",this.onClickButton.bind(this),false)

    },
    onClickButton:function(e){
      var target = e.target;
      if(target.tagName.toLowerCase()!=="button") return;
      switch(target.parentNode.className){
        case "delete":
          return this.onDelete(target.parentNode)
        case "set" :
          return this.onSet(target.parentNode)
        case "get" :
          return this.onGet(target.parentNode)
        case "delAll" :
          return this.onDelAll(target.parentNode);
      }
    },
    onDelete:function(node){
      var storage = ""+node.parentNode.id+"Storage"
      storage = storageOf(window[storage])
      storage.removeItem(node.querySelector('input.key').value.toString());
      this.list();

    },
    onSet:function(node){
      var storage = ""+node.parentNode.id+"Storage"
      storage = storageOf(window[storage])
      var key =node.querySelector('input.key').value,
        value = node.querySelector('input.value').value;
      if(key &&value) storage.setItem(key,value)
      this.list();

    },
    onGet:function(node){
      var storage = ""+node.parentNode.id+"Storage"
      storage = storageOf(window[storage])
      var key =node.querySelector('input.key').value;

      node.querySelector("input.value").value = JSON.stringify(storage.getItem(key)); 
    },
    onDelAll:function(node){
      var storage = ""+node.parentNode.id+"Storage"
      storage = storageOf(window[storage])
      storage.clear();
      this.list();
    }
  })
 var demo =  new StorageDemo();

})(window)
