var express = require("express"),
  http = require("http");
(bodyParser = require("body-parser")),
  (proxy = require("express-http-proxy")),
  (urlHelper = require("url"));

// ENV Variables
const BASE_URL = "dev.sunbirded.org";
const API_AUTH_TOKEN = "";
const USER_TOKEN = "";

var app = express();
app.set("port", 3000);
app.use(express.json());

app.use(
  ["/action/content/v3/update/*"],
  proxy(BASE_URL, {
    https: true,
    limit: "30mb",
    proxyReqPathResolver: function (req) {
      console.log("proxyReqOptDecorator ======> 1");
      console.log("Before -------> ", req.originalUrl);
      let originalUrl = req.originalUrl.replace("/action/", "/api/");
      originalUrl = originalUrl.replace("/v3/", "/v2/");
      console.log("After  -------> ", originalUrl);
      return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["user-id"] = "content-editor";
      proxyReqOpts.headers["Cookie"] = '';
      proxyReqOpts.headers["authorization"] = `Bearer ${API_AUTH_TOKEN}`;
      proxyReqOpts.headers["x-authenticated-user-token"] = USER_TOKEN;
      return proxyReqOpts;
    },
  })
);

app.use(
  [
    "/action/channel/v3/*",
    "/action/content/v3/*",
    "/action/framework/v3/*",
    "/action/composite/v3/*",
    "/action/language/v3/*",
  ],
  proxy(BASE_URL, {
    https: true,
    limit: "30mb",
    proxyReqPathResolver: function (req) {
      console.log("proxyReqOptDecorator ======> 2");
      console.log("Before -------> ", req.originalUrl);
      let originalUrl = req.originalUrl.replace("/action/", "/api/");
      originalUrl = originalUrl.replace("/v3/", "/v1/");
      console.log("After  -------> ", originalUrl);
      return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["user-id"] = "content-editor";
      proxyReqOpts.headers["authorization"] = `Bearer ${API_AUTH_TOKEN}`;
      proxyReqOpts.headers["x-authenticated-user-token"] = USER_TOKEN;
      return proxyReqOpts;
    },
  })
);

app.use(
  ["/action"],
  proxy(BASE_URL, {
    https: true,
    limit: "30mb",
    proxyReqPathResolver: function (req) {
      console.log("proxyReqOptDecorator ======> 3");
      console.log("Before -------> ", req.originalUrl);
      let originalUrl = req.originalUrl.replace("/action/", "/api/");
      console.log("After  -------> ", originalUrl);
      return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["user-id"] = "content-editor";
      proxyReqOpts.headers["authorization"] = `Bearer ${API_AUTH_TOKEN}`;
      proxyReqOpts.headers["x-authenticated-user-token"] = USER_TOKEN;
      return proxyReqOpts;
    },
  })
);

app.use(
  ["/assets", "/api"],
  proxy(BASE_URL, {
    https: true,
    limit: "30mb",
    proxyReqPathResolver: function (req) {
      console.log("proxyReqOptDecorator ======> 4");
      console.log("Before -------> ", req.originalUrl);
      return urlHelper.parse(req.originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["user-id"] = "content-editor";
      proxyReqOpts.headers["authorization"] = `Bearer ${API_AUTH_TOKEN}`;
      proxyReqOpts.headers["x-authenticated-user-token"] = USER_TOKEN;
      return proxyReqOpts;
    },
  })
);

app.use(
  [
    "/content/preview/*",
    "/content-plugins/*",
    "/assets/public/*",
    "/generic-editor/*",
    "/content-editor/*"
  ],
  proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
      console.log("proxyReqOptDecorator ======> 5");
      console.log("Before -------> ", req.originalUrl);
      return require("url").parse(`https://${BASE_URL}` + req.originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["user-id"] = "content-editor";
      proxyReqOpts.headers["authorization"] = `Bearer ${API_AUTH_TOKEN}`;
      return proxyReqOpts;
    },
  })
);
http.createServer(app).listen(app.get("port"), 3000);
