const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

    if (env.req.method == "POST") {
      user = validate(env.payload);
      let userExists = await validateExistance();
      if (!user) {
        lib.sendError(env.res, 400, "Invalid data");
        return;
      }
      if (userExists) {
        lib.sendError(env.res, 400, "User with defined login already exists");
        return;
      }
    }
  },
});
