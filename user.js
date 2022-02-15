const db = require("./db");
const lib = require("./lib");

const user = (module.exports = {
  handle: async function (env) {
    switch (env.req.method) {
      case "GET":
        role = env.urlParsed.query.role;
        const users = await db.users
          .find(role ? { roles: role } : {})
          .project({ id: 1, login: 1, firstName: 1, lastName: 1, roles: 1 })
          .toArray();
        if (users) {
          lib.sendJson(env.res, users);
        } else {
          lib.sendError(
            env.res,
            400,
            "Unexpected error occured while getting users"
          );
        }
        break;
      case "PUT":
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          let user = await db.users.findOne({ _id: _id });
          if (!user.roles.includes("manager")) {
            user.roles.push("manager");
          }
          let result = await db.users.findOneAndUpdate(
            { _id: _id },
            { $set: user },
            { returnOriginal: false }
          );
          if (result) {
            lib.webSocketRefreshUsers(env);
          }
        }
        break;
      case "DELETE":
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          db.users.findOneAndDelete({ _id }, async function (err, result) {
            if (!err) {
              lib.webSocketRefreshContracts(env);
              lib.webSocketRefreshProjects(env);
              lib.webSocketRefreshUsers(env);
              await db.contracts.deleteMany({ creator: _id });
              await db.projects.deleteMany({ creator: _id });
            } else {
              lib.sendError(env.res, 400, "users.findOneAndDelete() failed");
            }
          });
        } else {
          lib.sendError(
            env.res,
            400,
            "broken _id for delete " + env.urlParsed.query._id
          );
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
