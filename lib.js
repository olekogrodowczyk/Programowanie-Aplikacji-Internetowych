const lib = (module.exports = {
  sessions: {}, // { uuid: { }, ... }

  sendJson: function (res, obj = null) {
    res.writeHead(200, { "Content-type": "application/json" });
    if (obj != null) res.write(JSON.stringify(obj));
    res.end();
  },

  sendError: function (res, code, cause = "") {
    console.error(code, cause);
    res.writeHead(code, { "Content-type": "application/json" });
    res.write(JSON.stringify({ cause }));
    res.end();
  },

  // sprawdzenie uprawnien

  permissions: [
    { req: "^(POST|DELETE|GET|PUT) /auth", roles: [], error: null },
    { req: "%Post /deposit$", roles: ["admin", "manager"], error: null },
    { req: "^(POST|PUT|DELETE) ", roles: ["admin"], error: null },
    { req: "^POST /transfer$", roles: ["user"], error: null },
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

    console.log("permittedRoles", permittedRoles);

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
