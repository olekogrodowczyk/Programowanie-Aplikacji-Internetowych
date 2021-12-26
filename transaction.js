const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

    const sendAllTransactions = function (q = "") {
      db.transactions.find({}).toArray(function (err, transactions) {
        if (!err) {
          lib.sendJson(env.res, transactions);
        } else {
          lib.sendError(env.res, 400, "persons.aggregate() failed " + err);
        }
      });
    };

    switch (env.req.method) {
      case "GET":
        recipientId = db.ObjectId(env.urlParsed.query.recipientId);
        if (recipientId) {
          const transactions = db.transactions
            .find({ recipient: recipientId })
            .toArray(function (err, transactions) {
              if (!err) {
                lib.sendJson(env.res, transactions);
              } else {
                lib.sendError(env.res, 400, "transactions failed " + err);
              }
            });
        } else {
          sendAllTransactions(q);
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
