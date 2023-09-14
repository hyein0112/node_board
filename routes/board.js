const express = require("express");
const router = express.Router();

// db 연결
let db_config = require("../config/database");
let conn = db_config.init();

// 게시글 리스트 조회
router.get("/list", (req, res) => {
  const { q } = req.query;
  if (q) {
    const sql = `SELECT * FROM board WHERE writer_id LIKE '%${q}%' OR writer_name LIKE '%${q}%' OR content LIKE '%${q}%'`;
    conn.query(sql, (err, data) => {
      if (err) throw err;
      else if (data.length == 0)
        res.status(200).json({ message: `${q}에 대한 검색결과가 없습니다.` });
      else res.status(200).json({ data: data, message: "SUCCESS" });
    });
  } else {
    const sql = "SELECT * FROM board";
    conn.query(sql, (err, data) => {
      if (err) throw err;
      else res.status(200).json({ data: data, message: "SUCCESS" });
    });
  }
});

// 게시글 작성
router.post("/upload", (req, res) => {
  if (!req.session.sessionID)
    res.status(400).json({ message: "로그인 되지 않은 사용자입니다." });
  else {
    const sql = `INSERT INTO board ( writer_id, writer_name, title, content, time) VALUES (?, ?, ?, ?, now());`;
    conn.query(sql, Object.values(req.body), (err) => {
      if (err) throw err;
      else {
        res.status(200).json({ message: "SUCCESS" });
      }
    });
  }
});

router
  .route("/:id")

  // 게시글 수정
  .put((req, res) => {
    if (!req.session.sessionID)
      res.status(400).json({ message: "로그인 되지 않은 사용자입니다." });
    else {
      const sql = `UPDATE board SET ? WHERE id = '${req.body.id}'`;
      conn.query(sql, Object.values(req.body), (err) => {
        if (err) throw err;
        else {
          res.status(200).json({ message: "SUCCESS" });
        }
      });
    }
  })

  // 게시글 삭제
  .delete((req, res) => {
    const sql = `DELETE FROM board WHERE id = '${req.body.id}'`;
    conn.query(sql, (err) => {
      if (err) throw err;
      else res.status(200).json({ message: "SUCCESS" });
    });
  });

module.exports = router;
