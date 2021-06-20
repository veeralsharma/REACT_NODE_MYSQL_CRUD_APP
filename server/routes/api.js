const db = require("../db/database");
const express = require("express");

module.exports = function (params) {
  const app = params.api;

  var user_router = express.Router();
  app.use("/user", user_router);
  const userParams = {
    api: user_router,
  };
  require("./user")(userParams);

  var interview_router = express.Router();
  app.use("/interview", interview_router);
  const interviewParams = {
    api: interview_router,
  };
  require("./interview")(interviewParams);
};
