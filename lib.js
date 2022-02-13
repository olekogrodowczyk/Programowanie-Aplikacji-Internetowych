const ws = require("ws");

const lib = (module.exports = {
  sessions: {}, // { uuid: { }, ... }

  wsServer: null,

  sendJson: function (res, obj = null) {
    res.writeHead(200, { "Content-type": "application/json" });
    if (obj != null) res.write(JSON.stringify(obj));
    res.end();
  },

  webSocketRefreshPersons(env) {
    lib.broadcast({ type: "refreshPersons" }, function (client) {
      if (client.session == env.session) return false;
      let session = lib.sessions[client.session];
      return session && session.roles.includes("user");
    });
  },

  webSocketRefreshTransactions(env) {
    lib.broadcast({ type: "refreshTransactions" }, function (client) {
      if (client.session == env.session) return false;
      let session = lib.sessions[client.session];
      return session && session.roles.includes("admin");
    });
  },

  webSocketRefreshProjects(env) {
    lib.broadcast({ type: "refreshProjects" }, function (client) {
      if (client.session == env.session) return false;
      let session = lib.sessions[client.session];
      return session && session.roles.includes("admin");
    });
  },

  webSocketRefreshContracts(env) {
    lib.broadcast({ type: "refreshContracts" }, function (client) {
      if (client.session == env.session) return false;
      let session = lib.sessions[client.session];
      return session && session.roles.includes("manager");
    });
  },

  broadcast: function (data, selector = null) {
    let n = 0;
    lib.wsServer.clients.forEach(function (client) {
      if (client.readyState == ws.OPEN && (!selector || selector(client))) {
        client.send(JSON.stringify(data));
        n++;
      }
    });
    console.log("Sending a message ", data, "to", n, "clients");
  },

  sendError: function (res, code, cause = "") {
    console.error(code, cause);
    res.writeHead(code, { "Content-type": "application/json" });
    res.write(JSON.stringify({ cause }));
    res.end();
  },

  // sprawdzenie uprawnien

  permissions: [
    { req: "POST /register$", roles: [], error: null },
    { req: "^(POST|DELETE|GET|PUT) /auth", roles: [], error: null },
    { req: "^Post /deposit$", roles: ["admin"], error: null },
    { req: " ^(POST|PUT|DELETE|GET) /projects", roles: ["admin"], error: null },
    {
      req: " ^(POST|PUT|DELETE|GET) /contracts",
      roles: ["manager"],
      error: null,
    },
    { req: "^(POST|PUT|DELETE) ", roles: ["admin"], error: null },
    {
      req: "^(POST|PUT|DELETE) ",
      roles: "*",
      error: "You have to be logged as admin",
    },
  ],

  checkPermissions: function (reqStr, roles) {
    console.log("'" + reqStr + "'");
    let permittedRoles = [];
    for (let item of this.permissions) {
      let regexp = new RegExp(item.req);
      if (regexp.test(reqStr)) {
        permittedRoles = item.roles;
        break;
      }
    }

    // jeśli url ma pustą tablicę ról, jest niechroniony
    if (permittedRoles.length < 1) return true;
    if (!roles || roles.length < 1) return false;

    let intersection = [];
    roles.forEach(function (role) {
      if (permittedRoles.includes(role)) intersection.push(role);
    });
    return intersection.length > 0;
  },
});
