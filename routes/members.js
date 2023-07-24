const express = require("express");
const router = express.Router();

// db 연결
let db_config = require("../config/database");
let conn = db_config.init();

// 멤버 리스트 조회
router.get("/list", (_, res) => {
  var sql = "SELECT id, name, phone_number, profile_picture FROM member";
  conn.query(sql, (err, data) => {
    if (err) throw err;
    else res.json({ data: data, message: "SUCCESS" });
  });
});

router
  .route("/:id")

  //멤버 조회
  .get((req, res) => {
    const { id } = req.params;
    let sql = `SELECT id, name, phone_number, profile_picture FROM member WHERE id LIKE '${id}'`;
    conn.query(sql, (err, member) => {
      if (err) throw err;
      else if (member.length === 0) {
        res.status(404).json({ message: "잘못된 요청입니다." });
      } else {
        const boardsql = `SELECT B.id, B.title, B.content, B.time FROM board B INNER JOIN member M ON B.writer_id = M.id WHERE M.id = '${member[0].id}'`;
        conn.query(boardsql, (err, writePost) => {
          if (err) throw err;
          else {
            const data = Object.assign(member[0], {
              writePost: writePost,
              message: "SUCCESS",
            });
            res.json(data);
          }
        });
      }
    });
  })

  // 멤버 정보 수정
  .put((req, res) => {
    const sql = `UPDATE member SET ? WHERE id = '${req.params.id}'`;
    conn.query(sql, req.body, (err) => {
      if (err) throw err;
      else res.status(200).json({ message: "SUCCESS" });
    });
  })

  // 멤버 삭제
  .delete((req, res) => {
    const sql = `DELETE FROM member WHERE id = '${req.params.id}'`;
    conn.query(sql, (err) => {
      if (err) throw err;
      else res.status(200).json({ message: "SUCCESS" });
    });
  });

module.exports = router;
