/**
 * Created by wang on 2016/10/10.
 */
`http://paper.people.com.cn/rmrb/html/2016-10/10/nw.D110000renmrb_20161010_1-01.htm
http://paper.people.com.cn/rmrb/html/2016-10/09/nw.D110000renmrb_20161009_1-02.htm
http://paper.people.com.cn/rmrb/html/2016-10/10/nbs.D110000renmrb_01.htm
http://paper.people.com.cn/rmrb/html/2016-10/09/nbs.D110000renmrb_01.htm
http://www.cs.com.cn/
http://www.cnstock.com/
http://www.capitalweek.com.cn/
http://www.stcn.com/`
var buffer=require('buffer').Buffer
var iconv=require('iconv-lite')
var http=require('http')
var $=require('cheerio')
var async=require('async')
var mysql=require('mysql')
var config = require('./config.json')
var conn=mysql.createConnection(config.sql_option)
function public_crawler(url,handle_html,charset,cb){
    charset=charset||'GBK'
    http.get(url,function(res){
        var htm='',body=[]
        res.on('data',function(data){

            body.push(data)
        })
        res.on('end',function(){
            htm = $.load(iconv.decode(buffer.concat(body), charset))
            handle_html(htm, url, cb)
        })
    })
}
function promise_crawler(url, handle_html, charset,cb) {
    return new promise(function(resolve, reject) {
        charset = charset || 'GBK'
        http.get(url, function(res) {
            var htm = '',
                body = []
            res.on('data', function(data) {
                body.push(data)
            })
            res.on('end', function() {
                htm = $.load(iconv.decode(buffer.concat(body), charset))
                handle_html(htm, resolve, reject,cb)
            })
        })
    })
}
function get_info(list,handle_info, code,cb){
    async.eachSeries(list, function (item,next) {
        console.log("item =>", item)
        try{

            public_crawler(item,handle_info,code,next)
        }
        catch(e){
            console.log('--------load error------------')
            next()
        }
    }, function () {
        //conn.end()
        console.log('--------------------------------done')
        cb ? cb(): 0
    })
}
exports.conn=conn
exports.get_info=get_info
exports.crawler=public_crawler
exports.promise_crawler=promise_crawler


