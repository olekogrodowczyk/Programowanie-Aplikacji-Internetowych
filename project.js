const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

    validateData = (projectData) => {
      return projectData.name ? true : false;
    };

    if (env.req.method == "POST") {
      validationResult = validateData(env.payload);
      if (!validationResult) {
        lib.sendError(env.res, 400, "Invalid data");
        return;
      }
    }

    switch (env.req.method) {
      case "POST":
        let depositData = env.payload;
        depositData.creator = lib.sessions[env.session]._id;
        db.projects.insertOne(depositData, function (err, result) {
          if (!err) {
            lib.sendJson(env.res, depositData);
          } else {
            lib.sendError(env.res, 400, "transactions.insertOne() failed");
          }
        });
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
