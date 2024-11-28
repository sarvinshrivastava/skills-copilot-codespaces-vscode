// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/':
            showIndex(res);
            break;
        case '/add':
            add(req, res);
            break;
        default:
            res.end('404');
    }
});

function showIndex(res) {
    var filePath = path.join(__dirname, 'index.html');
    var rs = fs.createReadStream(filePath);
    rs.pipe(res);
}

function add(req, res) {
    var result = '';
    req.on('data', function (data) {
        result += data;
    });
    req.on('end', function () {
        var comment = qs.parse(result).comment;
        fs.appendFile('comments.txt', comment + '\n', function (err) {
            if (err) {
                res.end('Server error.');
            } else {
                res.end('Comment added.');
            }
        });
    });
}

server.listen(3000, function () {
    console.log('Server is running...');
});