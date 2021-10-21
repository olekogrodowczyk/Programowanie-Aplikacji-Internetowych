const http = require('http')
const nodestatic = require('node-static')

let server = http.createServer()
let fileServer = new nodestatic.Server('./frontend');

server.on('request', function(req, res) {
    console.log(req.method, req.url)
    if(req.url == '/rest') {
        let payload = ''
        req.on('data', function(data) {
            payload += data
        }).on('end', function() {
            try {
                payload = JSON.parse(payload)
                res.writeHead(200, 'OK', { 'Content-type': 'application/json' })
                res.write(JSON.stringify({ status: 'OK' }))
                res.end()    
            } catch(ex) {
                res.writeHead(400, 'JSON parse error', { 'Content-type': 'application/json' })
                res.write(JSON.stringify({ status: ex.message }))
                res.end()        
            }
        })
    } else
        fileServer.serve(req, res)
})

server.listen(7777)