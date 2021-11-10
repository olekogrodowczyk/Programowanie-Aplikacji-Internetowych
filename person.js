const db = require('./db')
const lib = require('./lib')

const person = module.exports = {

    handle: function(env) {

        let _id

        const sendAllPersons = function() {
            db.persons.find().toArray(function(err, persons) {
                if(!err) {
                    lib.sendJson(env.res, persons)
                } else {
                    lib.sendError(env.res, 400, 'persons.find() failed')
                }
            })              
        }

        switch(env.req.method) {
            case 'GET':
                sendAllPersons()
                break
            case 'POST':
                db.persons.insertOne(env.payload, function(err, result) {
                    if(!err) {
                        sendAllPersons()
                    } else {
                        lib.sendError(env.res, 400, 'persons.insertOne() failed')
                    }
                })
                break
            case 'DELETE':
                _id = db.ObjectId(env.urlParsed.query._id)
                if(_id) {
                    db.persons.findOneAndDelete({ _id }, function(err, result) {
                        if(!err) {
                            sendAllPersons()
                        } else {
                            lib.sendError(env.res, 400, 'persons.findOneAndDelete() failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Broken _id for delete ' + env.urlParsed.query._id)
                }
                break
            case 'PUT':
                _id = db.ObjectId(env.payload._id)
                if(_id) {
                    delete env.payload._id
                    db.persons.findOneAndUpdate({ _id }, { $set: env.payload }, { returnOriginal: false }, function(err, result) {
                        if(!err) {
                            sendAllPersons()
                        } else {
                            lib.sendError(env.res, 400, 'persons.findOneAndUpdate() failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Broken _id for update ' + env.urlParsed.query._id)
                }
                break
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}