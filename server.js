const http = require("http");
const url = require("url");
const nodestatic = require("node-static");
const uuid = require("uuid");
const cookies = require("cookies");

const lib = require("./lib");
const person = require("./person");
const db = require("./db");
const auth = require("./auth");
const example = require("./example");
const deposit = require("./deposit");
const register = require("./register");

let server = http.createServer();

server.on("request", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  let env = { req, res };
  let appCookies = new cookies(req, res);
  let session = appCookies.get("session");
  let now = Date.now();
  if (!session || !lib.sessions[session]) {
    session = uuid.v4();
    lib.sessions[session] = {
      from: req.connection.remoteAddress,
      created: now,
      touched: now,
    };
  } else {
    lib.sessions[session].from = req.connection.remoteAddress;
    lib.sessions[session].touched = now;
  }
  appCookies.set("session", session, { httpOnly: false });
  env.session = session;

  env.urlParsed = url.parse(req.url, true);
  if (!env.urlParsed.query) env.urlParsed.query = {};

  if (
    !lib.checkPermissions(
      req.method + " " + env.urlParsed.pathname,
      lib.sessions[session].roles
    )
  ) {
    lib.sendError(res, 403, "permission denied");
    return;
  }

  env.payload = "";
  req
    .on("data", function (data) {
      env.payload += data;
    })
    .on("end", function () {
      try {
        env.payload = env.payload ? JSON.parse(env.payload) : {};
      } catch (ex) {
        console.error(
          req.method,
          env.urlParsed.pathname,
          JSON.stringify(env.urlParsed.query),
          "ERROR PARSING:",
          env.payload
        );
        lib.sendError(res, 400, "parsing payload failed");
        return;
      }
      console.log(
        session,
        req.method,
        env.urlParsed.pathname,
        JSON.stringify(env.urlParsed.query),
        JSON.stringify(env.payload)
      );
      switch (env.urlParsed.pathname) {
        case "/auth":
          auth.handle(env);
          break;
        case "/person":
          person.handle(env);
          break;
        case "/deposit":
          deposit.handle(env);
          break;
        case "/register":
          register.handle(env);
          break;
        default:
          console.log("Error in requests");
      }
    });
});

db.init(function () {
  // for development only
  example.initialize();
  //
  server.listen(7777);
});
