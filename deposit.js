const db = require("./db");
const lib = require("./lib");
const transaction = require("./transaction");

const deposit = (module.exports = {
  handle: function (env) {
    const validate = function (depositData) {
      let result = {
        recipient: db.ObjectId(depositData.recipient),
        amount: depositData.amount,
      };
      return result.recipient && result.amount > 0 ? result : null;
    };

    let depositData = validate(env.payload);
    if (!depositData) {
      lib.sendError(env.res, 400, "invalid payload");
      return;
    }
    depositData.when = Date.now();
    switch (env.req.method) {
      case "POST":
        db.transactions.insertOne(depositData, async function (err, result) {
          if (!err) {
            lib.sendJson(env.res, depositData);
            let creator = await db.persons.findOne({
              _id: depositData.recipient,
            });
            depositData.recipientName =
              creator.firstName + " " + creator.lastName;
            depositData.type = "addDeposit";
            lib.broadcast(depositData);
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
