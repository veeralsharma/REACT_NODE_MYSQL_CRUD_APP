const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "itvbit",
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

module.exports = db;
