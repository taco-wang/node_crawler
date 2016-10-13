/**
 * Created by wang on 2016/10/13.
 */
var url='http://www.capitalweek.com.cn/magazine'
var $=require('cheerio')
var conn=require('./rmrb.js').conn
var crawler=require('./rmrb.js').crawler
var get_info=require('./rmrb.js').get_info
var base_url='http://www.capitalweek.com.cn'

crawler(url,get_latest_magezine,'utf-8',get_all_info)

function get_latest_magezine(htm,url,cb){
    var url_tmp=base_url+htm('.views-field-field-img').eq(0).find('a').attr('href')
    cb(url_tmp)
}

function get_all_info(url){
    crawler(url,get_all_a,'utf-8', function () {
        console.log('最后结束')
        conn.end()
    })
}

function get_all_a(htm,url,cb){
    var list=[]
    htm('div.view-magazine-content-list').find('a').each(function () {
           list.push(base_url+ $(this).attr('href'))
    })
    get_info(list,handle_info,'utf-8',cb)
}

function handle_info(htm,url,cb){
    var title=htm('#art_page_title_fx').text()
    var abstract=htm('.views-field-body').text()
    var content=htm('.pane-node-content').text()
    var time=htm('.views-field-created').text()
    console.log('插入一条数据')
    conn.query('INSERT INTO capitalweek(title,time,content,abstract) VALUES(?,?,?,?);',[title,time,content,abstract],cb)
}