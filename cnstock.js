/**
 * Created by wang on 2016/10/13.
 */
var url='http://news.cnstock.com/news/sns_yw/index.html'
var $=require('cheerio')
var conn=require('./rmrb.js').conn
var crawler=require('./rmrb.js').crawler
var get_info=require('./rmrb.js').get_info
function get_all_a(htm,url,cb){
    var temp=[]
    htm('.new-list').children().each(function () {

        $(this).find('a').attr('href')?temp.push($(this).find('a').attr('href')):0
    })
    cb(temp,get_content,'gbk', function () {
        console.log('---------------------end--------------------')
        conn.end()
    })
}
function get_content(htm,url,cb){
    var title=htm('#pager-content .title').text()
    var content=htm('#qmt_content_div p').text()
    var time=htm('#pager-content .timer').text()
    title ? conn.query('INSERT INTO new_cnstock(title,time,content) VALUES(?,?,?);',[title,time,content],cb):cb()

}
crawler(url,get_all_a,'utf-8',get_info)

