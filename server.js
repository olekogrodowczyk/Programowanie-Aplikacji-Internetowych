const http = require('http')
const nodestatic = require('node-static')

let server = http.createServer()
let fileServer = new nodestatic.Server('./frontend');

let persons = []

server.on('request', function(req, res) {
    console.log(req.method, req.url)
    if(req.url == '/rest') {
        let payload = ''
        req.on('data', function(data) {
            payload += data
        }).on('end', function() {
            switch(req.method) {
                case 'GET':
                    res.writeHead(200, 'OK', { 'Content-type': 'application/json' })
                    res.write(JSON.stringify(persons))
                    res.end()    
                    break
                case 'POST':
                    try {
                        payload = JSON.parse(payload)
                        persons.push(payload)
                        res.writeHead(200, 'OK', { 'Content-type': 'application/json' })
                        res.write(JSON.stringify(persons))
                        res.end()    
                    } catch(ex) {
                        res.writeHead(400, 'JSON parse error', { 'Content-type': 'application/json' })
                        res.write(JSON.stringify({ status: ex.message }))
                        res.end()        
                    }
                    break
            }
        })
    } else
        fileServer.serve(req, res)
})

server.listen(7777)