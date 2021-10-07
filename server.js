const http = require('http')

let server = http.createServer()

server.on('request', function(req, res) {
    console.log(req.method, req.url)
    res.writeHead(200, 'OK', { 'Content-type': 'text/plain' })
    res.write(req.method + ' ' + req.url)
    res.end()
})

server.listen(7777)