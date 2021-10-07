const http = require('http')
const nodestatic = require('node-static')

let server = http.createServer()
let fileServer = new nodestatic.Server('./frontend');

server.on('request', function(req, res) {
    console.log(req.method, req.url)
    // res.writeHead(200, 'OK', { 'Content-type': 'text/plain' })
    // res.write(req.method + ' ' + req.url)
    // res.end()
    fileServer.serve(req, res)
})

server.listen(7777)