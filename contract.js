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

    const sendAllContracts = async (q = "") => {
      await db.contracts.find({}).toArray(async function (err, contracts) {
        if (!err) {
          let newArray = await Promise.all(
            contracts.map(async function (contract) {
              const project = await db.projects.findOne({
                _id: contract.project,
              });
              const creator = await db.users.findOne({
                _id: contract.creator,
              });
              const contractor = await db.persons.findOne({
                _id: contract.contractor,
              });
              return {
                _id: contract._id,
                name: contract.name,
                payment: contract.payment,
                creationTime: contract.creationTime,
                creator: creator.firstName + " " + creator.lastName,
                contractor: contractor.firstName + " " + contractor.lastName,
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
            let creator = await db.users.findOne({ _id: contract.creator });
            let project = await db.projects.findOne({ _id: contract.project });
            let contractor = await db.persons.findOne({
              _id: contract.contractor,
            });
            contract.creator = creator.firstName + " " + creator.lastName;
            contract.project = project.name;
            contract.contractor = contract.firstName + " " + contract.lastName;
            contract.type = "contract";
            lib.broadcast(contract);
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
          contract.commited = true;
          var result = await db.contracts.findOneAndUpdate(
            { _id: contractId },
            { $set: contract },
            { returnOriginal: false }
          );
          if (result) {
            lib.sendJson(env.res, "Contract edited successfully");
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
          db.contracts.findOneAndDelete({ _id }, async function (err, result) {
            if (!err) {
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
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
