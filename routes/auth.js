const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// db 연결
let db_config = require("../config/database");
let conn = db_config.init();
db_config.connect(conn);

// 회원가입
router.post("/signup", (req, res) => {
  params = [
    req.body.id,
    req.body.pw,
    req.body.name,
    req.body.phone_number,
    req.body.address,
  ];

  bcrypt.hash(params[1], 10, (_, hash) => {
    params[1] = hash;
    const sql = "INSERT INTO member VALUES (?, ?, ?, ? ,?)";
    conn.query(sql, params, (err) => {
      if (err) throw err;
      else {
        res.status(200).json({ message: "SUCCESS" });
      }
    });
  });
});

// 로그인
router.post("/signin", (req, res) => {
  const sql = `SELECT id, pw FROM member WHERE id = '${req.body.id}'`;
  conn.query(sql, (err, data) => {
    if (err) throw err;
    else if (data.length > 0) {
      bcrypt.compare(req.body.pw, data[0].pw, (_, result) => {
        if (result) res.status(200).json({ message: "SUCCESS" });
        else res.status(400).json({ message: "올바르지 않은 비밀번호입니다." });
      });
    } else res.status(400).json({ message: "존재하지 않는 아이디입니다." });
  });
});

module.exports = router;
