#Puer 
Puer(普洱)，一个非常简单、但易于扩展的前端开发的静态服务器，整体围绕AutoReload功能，css更新样式，其他刷新html。 F5已经足够好用但是远远还满足不了我。


##优点

* __无环境要求__(除了node，前端不装node该批评)----针对[F5](http://www.getf5.com/ "F5官方网站") 还记得liunx下 air蛋疼的安装么. 
* __无侵入__ :
  1. 不需要修改任何原有页面或脚本等资源; 
  2. 不需要安装浏览器插件 ---- 针对 [LiveReload](http://livereload.com/) 而言。
* __无依赖__ :
  1. 与编辑器无关(无论你是[__vimer__](https://github.com/carlhuda/janus)还是[__sublimer__](http://www.sublimetext.com/))
  2. 与浏览器无关(ie6、mobile...沾socket.io的光) 
  3. 与系统无关(这个其实是废话..) ---- 嗯. LiveReload给Mac的高帅富用的。
  4. 与库无关,---- 针对[seajs](https://seajs.org)的autoreload插件.
* __自定义的脚本插件__:设置简单路由规则、(为了迎合广大的[expresser](http://expressjs.com/),虽然基本没用express的功能，但还是依赖了它，方便自定义功能扩展)添加mock数据真正实现__前后端分离__的开发 
* __API支持__: 写个编辑器插件?
* 天然支持markdown的预览哦，也autoreload的哦。。。

##缺点
* 无gui，基于命令行。(算不算缺点?)
* 由于针对于本地开发，我基本没有做任何缓存之类的优化，因为我相信:
>一切不以实现、需求为基石的性能问题都是纸老虎_. 

##安装 
`npm -g install puer`

当然你也可以fork一份自己折腾:

`git clone https://github.com/leeluolee/puer`


##使用
###命令行
__90%__的情况下, 你应该是这样用的...
```bash
cd path/to/your/static/dir #到你想去地方
puer #泡一杯普洱

```
或许你想更__深入__一点...
```bash
luobo > puer -h
```
或许你想扩展功能(Addon)..., 举个例子让你的静态服务器支持less的样式外链(不是简单的插入parser script哦)
```


```

###API
```js
//前提你已经安装了puer
var puer =require("puer")

```




##FAQ
####为什么取名Puer(普洱)？

喜欢云南，喜欢喝普洱, 最后...没发现拼音跟英文一样么， 好记。

####为什么做这个东西？

一直想基于nodejs想做一个类似grunt的大而全的构建工具。无奈要追赶的对手太强大，而平时工作基本还是简单的切页面写Demo原型(当然对我这种浮躁的人来讲，这也正好是打底子的工作)，没有实践就没有思考也很难有灵感, 而切页面时有强烈的需求要一个静态server,结果那个构建工具做了一点点就拆出了这个Puer。

####为什么代码这么烂？
coffeescript新兵 node api也不熟 基本都得翻手册写 见谅
