/**
 * Created by wang on 2016/10/11.
 */
var crawler = require('./rmrbLow.js').crawler
var http = require('http')
var async = require('async')
var $ = require('cheerio')
var promise = require('bluebird')
var iconv = require('iconv-lite')
var buffer = require('buffer').Buffer
var now = new Date()
var times = now.getFullYear() + '-' + (now.getMonth() + 1) + '/' + now.getDate()
var url = `http://paper.people.com.cn/rmrb/html/${times}/nbs.D110000renmrb_01.htm`
var base_url = `http://paper.people.com.cn/rmrb/html/${times}/`
var mysql = require('mysql')
var config = require('./config.json')
var conn = mysql.createConnection(config.sql_option)

function get_all_a_tag(htm) {
    var url_list = ttt(htm)
    get_contents(url_list)
}

function ttt(htm) {
    var html = $.load(htm)
    var url_list = []
    html('#pageList ul').children().each(function() {
        var href = $(this).find('.right_title-name a').attr('href').toString().replace('./', '')
        url_list.push(base_url + href)
    })
    return url_list
}

function promise_crawler(url, handle_html, charset) {
    return new promise(function(resolve, reject) {
        charset = charset || 'GBK'
        http.get(url, function(res) {
            var htm = '',
                body = []
            res.on('data', function(data) {
                body.push(data)
            })
            res.on('end', function() {
                htm = iconv.decode(buffer.concat(body), charset)
                handle_html(htm, resolve, reject)
            })
        })
    })
}

function get_contents(list) {
    var content_list = []
    var p_arr = []

    function get_info_url(htm, resolve, reject) {
        var html = $.load(htm)
        html('#titleList ul').children().each(function() {
            content_list.push(base_url + $(this).find('a').attr('href'))
        })
        resolve()
    }
    for (var i = 0, len = list.length; i < len; i++) {
        p_arr.push(promise_crawler(list[i], get_info_url, 'utf-8'))
    }
    promise.all(p_arr)
        .then(function() {
            load_data(content_list, function(err, rst) {
                conn.end()
            })
        })
}

function load_data(list, cb) {
    async.eachSeries(list, function(item, next) {
            try {
                crawler(item, handle_html_tmp, 'utf-8', function(err, rst) {
                    next();
                })
            } catch (e) {
                console.log("e =>", e);
                next();
            }
        },
        function(err) {
            err ? console.log(err) : cb(err, null);
        });
}

function handle_html_tmp(htm, cb) {
    var html = $.load(htm)
    var title = html('.text_c h1').text()
    var time = html('#riqi_').text()
    var content = html('#ozoom p').text()
    conn.query('INSERT INTO news_rmrb(title,time,content) VALUES(?,?,?);', [title, time, content], function(err, rst) {
        if (err) console.log(err)
        cb(err, rst)
    })
}

crawler(url, get_all_a_tag, 'utf-8')
