const db = require('./db')
const lib = require('./lib')

const auth = module.exports = {

    handle: function(env) {

         switch(env.req.method) {
            case 'GET':
                lib.sendJson(env.res, lib.sessions[env.session])
                break
            case 'POST':
                if(env.payload.login == 'admin' && env.payload.password == 'admin1') {
                    lib.sessions[env.session].login = env.payload.login
                    lib.sendJson(env.res, lib.sessions[env.session])
                } else {
                    lib.sendError(env.res, 401, 'authorization failed')
                }
                break
            case 'DELETE':
                delete lib.sessions[env.session].login
                lib.sendJson(env.res, lib.sessions[env.session])
                break
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}