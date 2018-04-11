# multiple-host-env

multiple-host-env use mini-proxy and multiple-host change host,fix multiple-host https keep-alive,use web page change

支持切换是https 断开连接

## Installation

```bash
$ git clone https://github.com/mj520/multiple-host-env.git
$ npm install
$ node main.js

change system proxy to 127.0.0.1:9393
change env http 127.0.0.1:9394
```

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
