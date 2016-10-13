
var async = require("async")
var superEngine = require('./csEngine.js').superEngine  
var conn = require('./csEngine.js').conn

var url1='http://www.cs.com.cn/xwzx/hg/'
var url2='http://www.cs.com.cn/xwzx/hwxx/'
var url3='http://www.cs.com.cn/ssgs/gsxw/'
var url4='http://www.cs.com.cn/ssgs/hyzx/'
var aUrl = [url1, url2,url3,url4]

async.eachSeries(aUrl, function (url,next) {
	console.log(url)
	superEngine(url, next)
}, function () {
	console.log('--------------------------------done')
	conn.end()
})
