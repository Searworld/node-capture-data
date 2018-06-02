//创建服务器

const url = require('url');
const JSDOM = require("jsdom").JSDOM;

// 载入中文分词模块
const Segment = require('segment');

const express = require('express')
var server = express()

server.listen(3000)



server.use('/getData',(req,res)=>{
    getUrl(req.query.str,data=>{
         const DOM= new JSDOM(data);
        const document = DOM.window.document;
        var regular =  document.querySelector("div").innerHTML.replace(/<[^>]+>/g,'')
        console.log(regular)

        // 创建实例
        const segment = new Segment();
        // 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
        segment.useDefault();
        var result = segment.doSegment(regular, {
            stripPunctuation: true,
            simple: true,
            stripStopword: true //去除停止符
        });

    //分词出现的次数
    var json ={}
    result.forEach(data=>{
        if(!json[data]) {
        json[data] = 1
    }else{
        json[data]++
    }
})

    // 去掉只出现一次的
    var timesArrary = []
    for(let item in json) {
        if(json[item] > 2) {
            timesArrary.push({
                name:item,
                value:json[item]
            })
        }
    }
    timesArrary.sort((val1,val2)=> val2.value - val1.value)
    res.send(timesArrary)
  })

})


function getUrl(sUrl, success) {
    var urlObj = url.parse(sUrl)
    var http = ""
    if (urlObj.protocol === 'http:') {
        http = require('http')
    }
    else {
        http = require('https')
    }
    let req = http.request({
        "hostname": urlObj.hostname,
        "path": urlObj.path
    },res=>{
        if(res.statusCode === 200) {
        var str =""
        res.on('data',buffer=>{
            str += buffer
    });
        res.on('end',()=>{
            success && success(str)
    })
    }
else if(res.statusCode === 302 || res.statusCode === 301){
        getUrl(res.headers.location,success)
    }
});
    req.end()
    req.on('error',()=>{
        console.log('404')
})
}
server.use(express.static('./'))
