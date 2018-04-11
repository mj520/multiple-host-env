var MiniProxy = require("./MiniProxy.js");
var fs = require("fs");
var http = require("http");
var express = require("express");
var ejs = require('ejs');
var app = express();
var proxyList = [];
function proxyRecord(host,ip){
    proxyList.unshift({host:host,ip:ip,time:new Date().format("yyyy-MM-dd hh:mm:ss")});
    if(proxyList.length > 10){
        proxyList.pop();
    }
}
var json = fs.readFileSync('config.json', 'utf8');
var config = JSON.parse(json);
var proxyPort = config.proxyPort||9393;
var httpPort = config.httpPort||9394;
// console.log(config);
var envList = config['envList'];
// console.log(envList);
var currentEnv = config['currentEnv'];

if(!currentEnv){
    for(env in envList){
        currentEnv = env;
        break;
    }
}
var hostMap = envList[currentEnv]==null?{}:envList[currentEnv];
console.log("currentEnv",currentEnv);
// console.log("hostMap",hostMap);

var myProxy = new MiniProxy({
	"port": proxyPort,
	"onBeforeRequest": function(requestOptions) {
        //console.log(requestOptions);

		// console.log("proxy request :" + requestOptions.host + (requestOptions.path || ''));
        if (hostMap[requestOptions.host] != undefined) {
            var ip = hostMap[requestOptions.host];
            proxyRecord(requestOptions.host,ip);
            requestOptions.host = ip;            
            return requestOptions;
        }
        for(host in hostMap){
            var tmp = host.replace(new RegExp('\\.', 'g'), "\\.");
            tmp = tmp.replace(new RegExp('\\*', 'g'), ".*?");
            var reg = new RegExp(tmp, "i");
            if(reg.test(requestOptions.host)){
                var ip = hostMap[host];
                proxyRecord(requestOptions.host,ip);
                requestOptions.host = ip;                
                return requestOptions;
            }
        }        
        return requestOptions;
    }
});

myProxy.start();
console.log("proxy start at "+proxyPort);



app.engine('html', ejs.renderFile);
app.set("view engine", "html");
app.get("/", function(req, res) {
    res.render("index", {
        title: "proxy for http & https change host",
        proxyList: proxyList,
        currentEnv: currentEnv,
        envList: envList,
        config:config
    });
});
app.get("/proxyList", function(req, res) {
    try{
        var data = {"f":1,"m":"ok","d":proxyList};
        res.end(JSON.stringify(data)); 
    } catch (e) {
        res.end('{"f":1,"m":"change error '+e.message+'"}'); 
    }
});
app.get("/change",function(req,res){
    try{
        query = req.query;
        currentEnv = query.env;
        if(envList[currentEnv] != null){
            hostMap = envList[currentEnv];
            config['currentEnv'] = currentEnv;
            fs.writeFileSync('config.json',JSON.stringify(config,null,4));
        }
        myProxy.change();
        res.end('{"f":1,"m":"change success '+currentEnv+'"}'); 
    } catch (e) {
        res.end('{"f":1,"m":"change error '+e.message+'"}'); 
    }
})
app.listen(httpPort);
console.log("http start in "+httpPort);

var c = require('child_process');
c.exec('start http://127.0.0.1:'+httpPort);

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}