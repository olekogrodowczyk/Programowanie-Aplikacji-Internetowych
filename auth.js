const db = require("./db");
const lib = require("./lib");

const auth = (module.exports = {
  handle: function (env) {
    switch (env.req.method) {
      case "GET":
        console.log(`Authenticated - ${lib.sessions[env.session].isAuth}`);
        let isAuthenticated = lib.sessions[env.session].isAuth;
        lib.sendJson(env.res, {
          isAuth: isAuthenticated,
          roles: lib.sessions[env.session].roles,
          login: lib.sessions[env.session].login,
          _id: lib.sessions[env.session]._id,
          firstName: lib.sessions[env.session].firstName,
          lastName: lib.sessions[env.session].lastName,
        });
        break;
      case "POST":
        db.users.findOne(
          { login: env.payload.login, password: env.payload.password },
          function (err, doc) {
            if (!err && doc) {
              lib.sessions[env.session].login = env.payload.login;
              lib.sessions[env.session].roles = doc.roles;
              lib.sessions[env.session].isAuth = true;
              lib.sessions[env.session]._id = doc._id;
              lib.sessions[env.session].firstName = doc.firstName;
              lib.sessions[env.session].lastName = doc.lastName;
              lib.sendJson(env.res, lib.sessions[env.session]);
            } else {
              lib.sendError(env.res, 401, "authorization failed");
            }
          }
        );
        break;
      case "DELETE":
        delete lib.sessions[env.session].login;
        delete lib.sessions[env.session].roles;
        delete lib.sessions[env.session].isAuth;
        delete lib.sessions[env.session]._id;
        delete lib.sessions[env.session].firstName;
        delete lib.sessions[env.session].lastName;
        lib.sendJson(env.res, lib.sessions[env.session]);
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
