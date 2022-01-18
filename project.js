const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";
    let currentUserId = lib.sessions[env.session]._id;

    validateData = (projectData) => {
      return projectData.name && projectData.managerId ? true : false;
    };

    managerExists = async (managerId) => {
      let manager = await db.users.find({ _id: managerId });
      return manager ? true : false;
    };

    if (env.req.method == "POST") {
      validationResult = validateData(env.payload);
      if (!validationResult) {
        lib.sendError(env.res, 400, "Invalid data");
        return;
      }
      managerExists = await managerExists(env.payload.managerId);
      if (!managerExists) {
        lib.sendError(env.res, 400, "Manager doesn't exist");
      }
    }

    switch (env.req.method) {
      case "POST":
        let project = {};
        project.creator = currentUserId;
        project.manager = env.payload.managerId;
        project.name = env.payload.name;
        db.projects.insertOne(project, function (err, result) {
          if (!err) {
            lib.sendJson(env.res, result);
          } else {
            lib.sendError(env.res, 400, "transactions.insertOne() failed");
          }
        });
        break;
      case "GET":
        const projects = await db.projects.find({}).toArray();
        if (projects) {
          lib.sendJson(env.res, projects);
        } else {
          lib.sendError(env.res, 400, "There are no projects");
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
