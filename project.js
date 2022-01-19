const db = require("./db");
const lib = require("./lib");

const project = (module.exports = {
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

    if (env.req.method == "POST" || env.req.method == "PUT") {
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

    const sendAllProjects = async (q = "") => {
      await db.projects.find({}).toArray(async function (err, transactions) {
        if (!err) {
          let newArray = await Promise.all(
            transactions.map(async function (project) {
              const manager = await db.users.findOne({
                _id: project.manager,
              });
              const creator = await db.users.findOne({
                _id: project.creator,
              });
              return {
                _id: project._id,
                name: project.name,
                timeCreation: project.timeCreation,
                creator: creator.firstName + " " + creator.lastName,
                manager: manager.firstName + " " + manager.lastName,
              };
            })
          );
          lib.sendJson(env.res, newArray);
        } else {
          lib.sendError(env.res, 400, "persons.aggregate() failed " + err);
        }
      });
    };

    switch (env.req.method) {
      case "POST":
        let project = {};
        project.creator = currentUserId;
        project.manager = db.ObjectId(env.payload.managerId);
        project.name = env.payload.name;
        project.timeCreation = Date.now();
        db.projects.insertOne(project, function (err, result) {
          if (!err) {
            lib.sendJson(env.res, result);
          } else {
            lib.sendError(env.res, 400, "transactions.insertOne() failed");
          }
        });
        break;
      case "GET":
        await sendAllProjects();
        break;
      case "PUT":
        _id = db.ObjectId(env.payload._id);
        if (_id) {
          let project = await db.projects.findOne({ _id: _id });
          project.name = env.payload.name;
          project.manager = db.ObjectId(env.payload.managerId);
          var result = await db.projects.findOneAndUpdate(
            { _id },
            { $set: project },
            { returnOriginal: false }
          );
          if (result) {
            lib.sendJson(env.res, "Project edited successfully");
          } else {
            lib.sendError(env.res, 400, "Error occurred in project editing");
          }
        } else {
          lib.sendError(
            env.res,
            400,
            "broken _id for update " + env.urlParsed.query._id
          );
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
