const http = require('http')
const url = require('url')
const nodestatic = require('node-static')

const lib = require('./lib')
const person = require('./person')

let server = http.createServer()
let fileServer = new nodestatic.Server('./frontend');

server.on('request', function(req, res) {
    let env = { req, res }
    env.urlParsed = url.parse(req.url, true)
    env.payload = ''
    req.on('data', function(data) {
        env.payload += data
    }).on('end', function() {
        try {
            env.payload = env.payload ? JSON.parse(env.payload) : {}
        }  catch(ex) {
            console.log(req.method, env.urlParsed.pathname, env.urlParsed.query, 'ERROR PARSING:', env.payload)
            lib.sendError(res, 400, 'parsing payload failed')
            return
        }
        console.log(req.method, env.urlParsed.pathname, env.urlParsed.query, env.payload)
        switch(env.urlParsed.pathname) {
            case '/person': 
                person.handle(env)
                break
            default:
                fileServer.serve(req, res)
        }
    })
})

server.listen(7777)