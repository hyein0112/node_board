var mysql = require("mysql");
require("dotenv").config();

var db_info = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: "root",
  password: process.env.DB_PW,
  database: "board",
};

module.exports = {
  init: function () {
    return mysql.createConnection(db_info);
  },
  connect: function (conn) {
    conn.connect(function (err) {
      if (err) console.error("mysql connection error : " + err);
      else console.log("mysql is connected successfully!");
    });
  },
};
