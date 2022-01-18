const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

    switch (env.req.method) {
      case "GET":
        role = env.urlParsed.query.role;
        console.log(role);
        const usersByRole = await db.users
          .find({ roles: role })
          .project({ id: 1, login: 1, firstName: 1, lastName: 1 })
          .toArray();
        if (usersByRole) {
          lib.sendJson(env.res, usersByRole);
        } else {
          lib.sendError(env.res, 400, "There are no projects");
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
