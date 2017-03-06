# puer-proxy

[![NPM version][npm-image]][npm-url] [![changelog][changelog-image]][changelog-url] [![license][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/puer-proxy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/puer-proxy
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/ufologist/puer-proxy/blob/master/LICENSE
[changelog-image]: https://img.shields.io/badge/CHANGE-LOG-blue.svg?style=flat-square
[changelog-url]: https://github.com/ufologist/puer-proxy/blob/master/CHANGELOG.md

> __more than a live-reload server , built for efficient frontend development__

在 `puer@1.1.1` 的基础上添加了自定义代理上下文的功能, 主要是为了实现[#36](https://github.com/leeluolee/puer/issues/36 "能否让代理功能和静态服务功能同时开启?")的需求, 与 [puer-mock](https://github.com/ufologist/puer-mock) 配合来使用(必须规范所有的 mock api 都在一个根路径下, 例如 `/api/`)

添加了如下命令行参数(都是针对代理功能的), 为了不与原来的 `puer` 冲突, 修改命令为: `puer-proxy`

```bash
  -c,--context <proxyContext>     proxy context
  -r,--rewrite <pathRewrite>      proxy pathRewrite
```

PS: 只修改了 `lib` 目录的代码, 没有同步修改 `src` 目录中的 `.coffee` 源码...

## puer-proxy 增强功能的使用方法

首先当然得安装了, 全局安装还是仅项目安装都可以, 不过一般推荐全局安装了

```shell
npm install puer-proxy -g
```

假设你要代理的后端接口在 `http://localhost:8080`, 一般的使用方法为同时指定代理的上下文并使用路径重写功能

```shell
puer-proxy -c /api/ -r -t http://localhost:8080
```

这样达到的效果是: 当请求 `http://localhost:8000/api/path/to/something` 时将请求代理给 `http://localhost:8080/path/to/something` 来处理, 默认的 `-r` 参数会将上下文路径(即这里的 `/api/`)重写为空字符串再提交给代理的服务器

如果你习惯将所有的 mock api 都定义在 `/api/` 路径下, 那么可以更简单的运行下面的命令

```shell
puer-proxy -r -t http://localhost:8080
```

下面详情解释每个参数的含义

* 自定义代理的上下文(`-c,--context`), 默认为 `/api/`

  ```shell
  puer-proxy -c /api/ -t http://localhost:8080
  ```

  即当请求 `http://localhost:8000/api/path/to/something` 时将请求代理给 `http://localhost:8080/api/path/to/something` 来处理

  注意: **以斜杠结尾, 否则会匹配到 /api123 这样的路径**
* 关闭路径重写功能

  不要在命令行传入 `-r` 参数, 即达到上面"自定义代理的上下文"例子中的效果
* 自定义路径重写功能(`-r,--rewrite`)

  ```shell
  puer-proxy -c /api/ -r /abc/ -t http://localhost:8080
  ```

  即当请求 `http://localhost:8000/api/path/to/something` 时将请求代理给 `http://localhost:8080/abc/path/to/something` 来处理
* 与 `puer-mock` 搭配使用的例子

  ```shell
  puer-proxy -a _mockserver.js -c /api/ -r -t http://localhost:8080
  ```

## puer 原本功能的使用方法

其他使用说明请参考官网文档 [leeluolee/puer](https://github.com/leeluolee/puer), 非常感谢 [leeluolee/puer](https://github.com/leeluolee/puer) 给我们带来了很多效率的提升.