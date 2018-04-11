# multiple-host-env

multiple-host-env change host,fix multiple-host https keep-alive,use web page change

# web 管理
支持切换 https 断开连接，和http一样

## Installation

```bash
$ git clone https://github.com/mj520/multiple-host-env.git
$ npm install
$ node main.js

change system proxy to 127.0.0.1:9393
change env http 127.0.0.1:9394
```

## 引用 multiple-host、mini-proxy、解决环境改变 https keep-alive 问题
https://github.com/liyangready/multiple-host
无论你是开发、QA还是产品，在目前的开发及测试中都离不开host。host为开发和测试带来了诸多便利，但也有很多烦恼：
切换host总是不能立即生效，换一套host环境经常需要重启浏览器。
经常在一套host环境下比如（betaA）想对比一下线上的情况，做不到。
由于经常在多套host环境中切换，导致系统host环境乱七八糟，发现问题都不确定到底在哪套环境下。
multiple-host 就是为了解决烦人的host问题而诞生的 , 它采用了 沙箱机制，在一个独立的浏览器进程中使用host。


## config.json 支持域名指向ip
```
{
    "proxyPort": 9393,
    "httpPort": 9394,
    "currentEnv": "online",
    "envList": {
        "online": {},
        "dev": {
            "xcx-admin.duomai.com ": "192.168.1.176",
            "xcx-img.p1j2.com": "140.205.132.239",
            "xcx-img.zmwxxcx.com ": "140.205.132.239",
            "*.p1j2.com": "192.168.1.176",
            "*.zmwxxcx.com": "192.168.1.176"
        },
        "local-api": {
            "*.p1j2.com": "192.168.99.100",
            "*.zmwxxcx.com": "192.168.99.100"
        },
        "local-web-and-api": {
            "xcx.duomai.com": "127.0.0.1",
            "*.p1j2.com": "192.168.99.100",
            "*.zmwxxcx.com": "192.168.99.100"
        },
        "local-web-online-api": {
            "xcx.duomai.com": "127.0.0.1",
            "xcx-img.p1j2.com": "140.205.132.239",
            "xcx-img.zmwxxcx.com ": "140.205.132.239",
            "*.p1j2.com": "47.97.11.196",
            "*.zmwxxcx.com": "47.97.11.196"
        }
    }
}
```
