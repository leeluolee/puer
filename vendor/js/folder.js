
if(document.addEventListener){
  document.addEventListener("touchstart", function(){}, true)
}
var slice = [].slice;

function _type(_o) {
    return _o == null /*means null or undefined*/
    ? String(_o) : Object.prototype.toString.call(_o).slice(8, -1).toLowerCase();
}

// 数据序列化
function _serialize(_data){
    if(_type(_data) == "string"){
        return _data;
    }
    var _result =""
    for(var _i in _data){
        if(_data.hasOwnProperty(_i)){
            _result+=_i+"=" + String(_data[_i]) +"&"
        }
    }
    return _result.slice(0,-1);
}

// 2.ajax 简单XHR实现 
// ==============================================================================
//原生XMLHttpRequest
var _getXHR = window["XMLHttpRequest"] ?
function() {
    return new XMLHttpRequest()
} : function() {
    return new ActiveXObject('Microsoft.XMLHTTP')
}

var _extend = function(o1, o2, override){
  for(var i in o2){
    if(o1[i] ==null || override){
      o1[i] = o2[i]
    }
  }
  return o1;
}
 // function 
    _extend(Function.prototype, {
        bind: function(context, args) {
            args = slice.call(arguments, 1);
            var fn = this;
            return function() {
                fn.apply(context, args.concat(slice.call(arguments)));
            }
        }
    })

_XHR._process = {
    json: function(_text, _xml) {
        return eval("(" + _text + ")");
    },
    text: function(_text, _xml) {
        return text;
    }
}

function _XHR(_setting) {
    this._xhr = _getXHR();
    this._initSetting(_setting);
    
    if (_setting._send) this._send()
}
_extend(_XHR.prototype, {
    _initSetting: function(_setting) {
        if (!_setting) _setting = {};
        this._setting = _extend(_setting || {}, {
            _method: "get",
            _send: false,
            _async: true,
            _type: "json",
            // xhr 的默认头部
            _headers: {
            }
        })
    },
    _isSuccess: function() {
        var _status = this._xhr.status;
        return (_status >= 200 && _status < 300);
    },
    _onStateChange: function() {
        var _xhr = this._xhr;
        if (_xhr.readyState != 4) return;

        if (this._isSuccess()) {
            this._success(_xhr.responseText, _xhr.responseXML);
        }
    },
    _success: function(_text, _xml) {
        this._setting._onSuccess.call(this, this._process(_text), _xml);
    },
    _process: function(_text) {
        return _XHR._process[this._setting._type](_text);
    },
    _setHeader: function(_name, _value) {
        if (_type(_name) == "object") {
            for (var _i in _name) {
                if (_name.hasOwnProperty(_i)) {
                    this._setHeader(_i, _name[_i])
                }
            }
            return this;
        }
        this._xhr.setRequestHeader(_name, _value);
        return this;
    },
    _getHeader: function(_name) {
        this._xhr.getResponseHeader(_name);
        return this;
    },
    _send: function(_data) {
        var _xhr = this._xhr,_setting=this._setting;
        _data = _data || _setting._data ||{};
        _data = _serialize(_data)
        this._setHeader(_setting._headers);
        if(_setting._method.toLowerCase()=="get"){
            _setting.url+= _data? ('?'+data): '';
        }
        _xhr.open(_setting._method.toUpperCase(), _setting.url, _setting._async)
        _xhr.onreadystatechange = this._onStateChange.bind(this);
        
        _xhr.send(_serialize(_data))
    }
});
/**
 * 简单 ajax 接口
 * setting参数 :
 *     _url : 请求地址,
 *     _method : 请求方式 默认GET,
 *     _type : 格式 默认json,
 *     _onSuccess(_data,_status,_xhr) : 这里的data可能为xml json 或者文本 xhr为原生xhr
 *     _onError(_error): 没啥好说的
 *     _onComplete(_data,_status,_xhr) :在success与 error 之后调用
 *     _send :true | false 是否立即发送  默认false
 *     _async : 是否异步 默认 true
 *     _data :请求参数
 *
 * @param  {String|Object}   _url url或者setting 取决于type
 * @param  {Function} _cb  回调
 * @return {[type]}
 */


function _$ajax(_url, _cb) {
    if (_type(_url) == "string" && _type(_cb) == "function") {
        return new _XHR({
            url: _url,
            _onSuccess: _cb
        })
    } else {
        return new _XHR(_url)
    }
}

function _addListener(_el, _type, _cb) {
    if (_el.addEventListener) return _el.addEventListener(_type, _cb, false)
    else if (_el.attachEvent) return _el.attachEvent("on" + _type, _cb);
}

var link;
if(link = document.getElementById('weinre')){
  link.setAttribute('href', (location.protocol+"//"+location.host).replace(/\:\d+/,'') + ':9001/client/#anonymous')
}

_$ajax('/puer/qrcode?url='+encodeURIComponent(location.href), function(json){
  if(json){
    document.getElementById('qrcode').innerHTML = json.result
  }
})._send()
