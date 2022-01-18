const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

    validateData = (projectData) => {
      return projectData.manager && projectData.name ? true : false;
    };

    validateExistance = async (managerId) => {
      let result = await db.users.findOne({
        _id: db.ObjectId(managerId),
      });
      return result ? true : false;
    };

    if (env.req.method == "POST") {
      validationResult = validate(env.payload);
      if (!validationResult) {
        lib.sendError(env.res, 400, "Invalid data");
        return;
      }
      let managerExists = await validateExistance(env.payload.managerId);
      if (!userExists) {
        lib.sendError(env.res, 400, "Defined manager doesn't exist");
        return;
      }
    }

    switch (env.req.method) {
      case "POST":
        db.transactions.insertOne(depositData, function (err, result) {
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
