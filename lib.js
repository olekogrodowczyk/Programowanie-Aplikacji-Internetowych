const lib = module.exports = {

    sendJson: function(res, obj = null) {
        res.writeHead(200, { 'Content-type': 'application/json' })
        if(obj != null) res.write(JSON.stringify(obj))
        res.end()    
    },

    sendError: function(res, code, cause = '') {
        console.error(code, cause)
        res.writeHead(code, { 'Content-type': 'application/json' })
        res.write(JSON.stringify({ cause }))
        res.end()    
    }

}