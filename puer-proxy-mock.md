# [puer-proxy](https://github.com/ufologist/puer-proxy) 与 [puer-mock](https://github.com/ufologist/puer-mock) 搭配使用让你快速切换真假接口

请先确保安装好 `puer-proxy` 和 `puer-mock`, 安装方法请参考官方的文档.

## 为什么要做这个

* 现在前端开发一般会预先定义好接口规范, 然后就可以前后端并行开发了
* 为了方便在后端接口未实现的时候, 前端写页面有假数据可用, 我实现了 [puer-mock](https://github.com/ufologist/puer-mock) 来专门根据接口定义来生成假数据
* 后端接口逐步完成后, 我们又如何快速地从假接口切换到真实的接口来完成联调的工作呢? 于是 [puer-proxy](https://github.com/ufologist/puer-proxy) 就此诞生了

## 使用场景

* 假设我们通过 `puer-mock` 定义了下面的接口

  ```json
  "GET /api/user": {
      "disabled": false,
      "info": {
          "summary": "获取用户信息",
          "module": "用户",
          "description": "获取用户信息",
          "author": "Sun"
      },
      "response": {
          "status": 0,
          "statusInfo": {
              "message": "ok"
          },
          "data": {
              "user": {
                  "id": "@id",
                  "name": "@cname"
              }
          }
      }
  }
  ```
* 后端的接口将会在 `http://localhost:8080` 上实现(本地开发环境)

  即上面的这个获取用户信息的接口, 在后端实现后, 对应的接口地址是 `http://localhost:8080/user`
* 然后我们通过 `puer-proxy` 来做开发

  ```shell
  puer-proxy -a _mockserver.js -r -t http://localhost:8080
  ```
* 随时切换假接口和真实的后端接口

  通过切换 `disabled` 的值, `false` 为使用假接口, `true` 为使用真实的后端接口, 相当于一键切换了

更多详细的参数配置和使用手册, 请参考 [puer-proxy](https://github.com/ufologist/puer-proxy) 和 [puer-mock](https://github.com/ufologist/puer-mock) 的官方文档.