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
function public_crawler(url,handle_html,charset,cb){
    charset=charset||'GBK'
    http.get(url,function(res){
        var htm='',body=[]
        res.on('data',function(data){

            body.push(data)
        })
        res.on('end',function(){
            htm=iconv.decode(buffer.concat(body),charset)
            handle_html(htm, cb)
        })
    })
}
exports.crawler=public_crawler
