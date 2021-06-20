const db = require("../db/database");

module.exports = function (params) {
  const app = params.api;

  app.post("/add", (req, res) => {
    let user = req.body;
    let sql = "INSERT INTO users SET ?";
    let query = db.query(sql, user, (err, result) => {
      if (err) {
        res.send({
          status: 500,
          message: err.message,
        });
      }
      res.send({
        status: 201,
        message: result.insertId,
      });
    });
  });

  app.get("/get", (req, res) => {
    let sql = "select * from users";
    let query = db.query(sql, (err, result) => {
      if (err) {
        res.send({
          status: 500,
          message: err.message,
        });
      }
      res.send({
        status: 200,
        message: result,
      });
    });
  });

  app.get("/get/:userid", (req, res) => {
    var sql = `SELECT * from users WHERE user_id=${req.params.userid}`;
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: 500,
          message: err.message,
        });
      }
      res.send({
        status: 200,
        message: result[0],
      });
    });
  });


  app.post("/get/email", (req, res) => {
    var sql = `SELECT * from users WHERE email='${req.body.email}'`;
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: 500,
          message: err.message,
        });
      }
      res.send({
        status: 200,
        message: result[0],
      });
    });
  });
};
