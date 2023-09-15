const express = require("express");
const bcrypt = require("bcrypt");
const axios = require("axios");
require("dotenv").config();

axios.default.withCredentials = true;

const router = express.Router();

// db 연결
let db_config = require("../config/database");
let conn = db_config.init();

// 회원가입
router.post("/signup", (req, res) => {
  params = [req.body.id, req.body.pw, req.body.nickname, req.body.phone_number];

  bcrypt.hash(params[1], 10, (_, hash) => {
    params[1] = hash;

    const sql = `SELECT * FROM member WHERE id = '${params[0]}' OR phone_number = '${params[3]}'`;
    conn.query(sql, (err, data) => {
      if (err) throw err;
      else if (data.length >= 1) {
        console.log(data);
        res.status(400).json({ message: "이미 가입된 회원입니다." });
      } else {
        const sql =
          "INSERT INTO member (id, pw, nickname, phone_number) VALUES (?, ?, ?, ?)";
        conn.query(sql, params, () => {
          if (err) throw err;
          else {
            res.status(200).json({ message: "SUCCESS" });
          }
        });
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
        if (result) {
          req.session.sessionID = { id: data[0].id };
          res.status(200).json({ message: "SUCCESS" });
        } else
          res.status(400).json({ message: "올바르지 않은 비밀번호입니다." });
      });
    } else res.status(400).json({ message: "존재하지 않는 아이디입니다." });
  });
});

// 로그아웃
router.post("/signout", (req, res) => {
  if (req.session.sessionID) {
    req.session.destroy((err) => {
      if (err) console.log(err);
      else res.status(200).json({ message: "SUCCESS" });
    });
  } else {
    res.json({ message: "이미 로그아웃 된 회원입니다." });
  }
});

module.exports = router;
