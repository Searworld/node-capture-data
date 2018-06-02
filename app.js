const url = require('url')
const fs = require('fs')
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;

var index =0;

getUrl('https://www.readnovel.com/chapter/6833112003304401/23555917591170998',data=>{

     var html = gbk.toString('utf-8',data); //乱码情况下转化成utf-8格式

     const DOM= new JSDOM(data);
     const document = DOM.window.document;
     var regular =  document.querySelector(".read-content").innerHTML.replace(/<[^>]+>/g,'')
 console.log(regular)

    // fs.writeFile('story.html',data)
})

function getUrl(sUrl, success) {
    index++;
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
           var arr = []
         var str =""
           res.on('data',buffer=>{
               arr.push(buffer)
               str += buffer
            });
           res.on('end',()=>{
               // let result = Buffer.concat(arr);
           success && success(str)
        })
       }
       else if(res.statusCode === 302 || res.statusCode === 301){
           console.log(`我是${index}次重定向`)
            getUrl(res.headers.location,success)
        }
    });
    req.end()
    req.on('error',()=>{
        console.log('404')
    })
}