const uuid = require('uuid')
const lib = require('./lib')

const person = module.exports = {

    data: [],

    handle: function(env) {
        switch(env.req.method) {
            case 'GET':
                lib.sendJson(env.res, person.data)
                break
            case 'POST':
                env.payload._id = uuid.v4()
                person.data.push(env.payload)
                lib.sendJson(env.res, person.data)
                break
            case 'DELETE':
                person.data = person.data.filter(function(obj) { return obj._id != env.urlParsed.query._id })
                lib.sendJson(env.res, person.data)
                break
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}