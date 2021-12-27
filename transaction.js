const db = require("./db");
const lib = require("./lib");

const person = (module.exports = {
  handle: async function (env) {
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

    const sendAllTransactions = async function (q = "") {
      await db.transactions
        .find({})
        .toArray(async function (err, transactions) {
          if (!err) {
            let newArray = await Promise.all(
              transactions.map(async function (obj) {
                const recipient = await db.persons.findOne({
                  _id: obj.recipient,
                });
                return {
                  _id: obj._id,
                  recipient: obj.recipient,
                  amount: obj.amount,
                  when: obj.when,
                  recipientName: recipient.firstName + " " + recipient.lastName,
                };
              })
            );
            console.log(newArray);
            lib.sendJson(env.res, newArray);
          } else {
            lib.sendError(env.res, 400, "persons.aggregate() failed " + err);
          }
        });
    };

    switch (env.req.method) {
      case "GET":
        recipientId = db.ObjectId(env.urlParsed.query.recipientId);
        if (recipientId) {
          const recipient = await db.persons.findOne({ _id: recipientId });
          const transactions = db.transactions
            .find({ recipient: recipientId })
            .toArray(function (err, transactions) {
              if (!err) {
                let newArray = transactions.map(function (obj) {
                  return {
                    _id: obj._id,
                    recipient: obj.recipient,
                    amount: obj.amount,
                    when: obj.when,
                    recipientName:
                      recipient.firstName + " " + recipient.lastName,
                  };
                });
                lib.sendJson(env.res, newArray);
              } else {
                lib.sendError(env.res, 400, "transactions failed " + err);
              }
            });
        } else {
          await sendAllTransactions(q);
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
