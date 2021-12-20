const db = require("./db");
const lib = require("./lib");

const register = (module.exports = {
  handle: async function (env) {
    const validateExistance = async function (loginParameter) {
      let result = await db.users.findOne({ login: env.payload.login });
      return result ? true : false;
    };

    const validate = function (credentials) {
      let userToAdd = {
        login: credentials.login,
        password: credentials.password,
        roles: ["user"],
      };
      return credentials.password === credentials.passwordConfirm
        ? userToAdd
        : null;
    };

    let user = {};

    if (env.req.method == "POST") {
      user = validate(env.payload);
      let userExists = await validateExistance();
      if (!user) {
        lib.sendError(env.res, 400, "invalid payload");
        return;
      }
      if (userExists) {
        lib.sendError(env.res, 400, "user already exists");
        return;
      }
    }

    switch (env.req.method) {
      case "POST":
        db.users.insertOne(user, function (err, result) {
          if (!err) {
            lib.sendJson(env.res, result._id);
          } else {
            lib.sendError(env.res, 400, "persons.insertOne() failed");
          }
        });
        break;
    }
  },
});
