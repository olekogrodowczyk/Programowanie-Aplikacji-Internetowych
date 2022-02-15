const db = require("./db");
const lib = require("./lib");

const contract = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";
    let project = {};

    validate = (contract) => {
      if (
        !contract.name ||
        !contract.startTime ||
        !contract.endTime ||
        !contract.payment ||
        !contract.contractorId ||
        !contract.projectId
      ) {
        return false;
      }
      if (contract.startTime > contract.endTime) {
        return false;
      }
      return true;
    };

    checkProject = async (projectId) => {
      console.log(projectId);
      let project = await db.projects.findOne({ _id: db.ObjectId(projectId) });
      if (project) {
        return projectId;
      } else {
        return false;
      }
    };

    checkContractor = async (contractorId) => {
      let contractor = await db.persons.findOne({
        _id: db.ObjectId(contractorId),
      });
      if (contractor) {
        return contractorId;
      } else {
        return false;
      }
    };

    createContract = async () => {
      if (!validate(env.payload)) {
        return false;
      }
      let project = await checkProject(env.payload.projectId);
      let contractor = await checkContractor(env.payload.contractorId);
      if (!project && !contractor) {
        return false;
      }
      return {
        name: env.payload.name,
        payment: env.payload.payment,
        startTime: env.payload.startTime,
        endTime: env.payload.endTime,
        project: db.ObjectId(project),
        creator: db.ObjectId(lib.sessions[env.session]._id),
        contractor: db.ObjectId(contractor),
        creationTime: Date.now(),
        commited: false,
      };
    };

    const getAllUserProjects = async (userId) => {
      let projects = await db.projects
        .find({ manager: userId })
        .project({ _id: 1 })
        .toArray();
      return projects;
    };

    const sendAllContracts = async (q = "") => {
      let forAdmin = false;
      let currentUserId = "";
      let project = {};
      if (lib.sessions[env.session]?.roles?.includes("admin")) {
        forAdmin = true;
        console.log(forAdmin);
      } else {
        currentUserId = db.ObjectId(lib.sessions[env.session]?._id);
      }
      let projects = (await getAllUserProjects(currentUserId)).map(
        (x) => x._id
      );
      await db.contracts
        .find(forAdmin ? {} : { project: { $in: projects } })
        .toArray(async function (err, contracts) {
          if (!err) {
            let newArray = await Promise.all(
              contracts.map(async function (contract) {
                const project = await db.projects.findOne({
                  _id: contract.project,
                });
                const manager = await db.users.findOne({
                  _id: project.manager,
                });
                const contractor = await db.persons.findOne({
                  _id: contract.contractor,
                });
                return {
                  _id: contract._id,
                  name: contract.name,
                  payment: contract.payment,
                  creationTime: contract.creationTime,
                  manager: manager?.firstName + " " + manager?.lastName,
                  contractor:
                    contractor?.firstName + " " + contractor?.lastName,
                  project: project.name,
                  startTime: contract.startTime,
                  endTime: contract.endTime,
                  commited: contract.commited,
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
        let contract = await createContract();
        if (!contract) {
          lib.sendError(env.res, 400, "Invalid payload");
          return;
        }
        db.contracts.insertOne(contract, async function (err, result) {
          if (!err) {
            lib.sendJson(env.res, result);
            lib.webSocketRefreshContracts(env);
          } else {
            lib.sendError(env.res, 400, "transactions.insertOne() failed");
          }
        });
        break;
      case "GET":
        await sendAllContracts();
        break;
      case "PUT":
        contractId = db.ObjectId(env.urlParsed.query.contractId);
        if (contractId) {
          let contract = await db.contracts.findOne({ _id: contractId });
          if (
            lib.checkPermission(lib.sessions[env.session].roles, ["manager"]) &&
            contract.creator === db.ObjectId(lib.sessions[env.session]._id)
          ) {
            lib.sendError(env.res, 403, "You have to be either admin or owner");
            return;
          }
          contract.commited = true;
          var result = await db.contracts.findOneAndUpdate(
            { _id: contractId },
            { $set: contract },
            { returnOriginal: false }
          );
          if (result) {
            lib.sendJson(env.res, "Contract edited successfully");
            let deposit = {
              recipient: contract.contractor,
              amount: contract.payment,
              when: Date.now(),
            };
            await db.transactions.insertOne(deposit);
            lib.webSocketRefreshContracts(env);
            lib.webSocketRefreshPersons(env);
            lib.webSocketRefreshTransactions(env);
          } else {
            lib.sendError(env.res, 400, "Error occurred in contract editing");
          }
        } else {
          lib.sendError(
            env.res,
            400,
            "broken _id for update " + env.urlParsed.query._id
          );
        }
        break;
      case "DELETE":
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          let contract = await db.contracts.findOne({ _id: _id });
          if (
            lib.checkPermission(
              !(lib.sessions[env.session]?.roles, ["admin"])
            ) &&
            contract.creator !== db.ObjectId(lib.permissions[env.session]._id)
          ) {
            lib.sendError(env.res, 403, "You have to be either admin or owner");
          }
          db.contracts.findOneAndDelete({ _id }, async function (err, result) {
            if (!err) {
              lib.webSocketRefreshContracts(env);
              lib.sendJson(env.res, "Contract deleted successfully");
            } else {
              lib.sendError(env.res, 400, "projects.findOneAndDelete() failed");
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
