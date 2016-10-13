/**
 * Created by wang on 2016/10/12.
 */
var promise_crawler=require('./rmrb.js').promise_crawler
var crawler = require('./rmrb.js').crawler
var $ = require('cheerio')
var promise = require('bluebird')
var mysql = require('mysql')
var config = require('./config.json')
var async = require('async')
var conn=mysql.createConnection(config.sql_option)

function superEngine(url, cb){
    crawler(url, get_all_a_tag, 'gb2312', cb)
}

function get_all_a_tag(htm,url,cb){
    var list=[]
    var urlTmp = url.split("/").slice(0, (url.split("/").length -2)).join("/") + "/"
    htm('.column-box ul').children().each(function(){list.push( $(this).find('a').attr('href').toString().indexOf("../") ? url+ $(this).find('a').attr('href').toString().replace('./','') : urlTmp + $(this).find('a').attr('href').toString().replace('../','') )})
    get_info(list, 'gb2312',cb)
}

function get_info(list,code, cb){
    async.eachSeries(list, function (item,next) {
    console.log("item =>", item)
        try{
            crawler(item,handle_info,code,next)
        }
        catch(e){
            console.log('--------load error------------')
            next()
        }
    }, function () {

        console.log('--------------------------------done')
	    cb()
    })
}

function handle_info(htm,url,next){
    var title=htm('.column-box h1').text()
    var content=htm('.Dtext p').text()
    var time=htm('.ctime01').text().toString().split('|')[0]
    conn.query('INSERT INTO news_cs(title,time,content) VALUES(?,?,?);',[title,time,content], function () {
        next()
    })
}

exports.superEngine=superEngine 
exports.conn=conn


