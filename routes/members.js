const express = require("express");
const router = express.Router();

// db 연결
let db_config = require("../config/database");
let conn = db_config.init();
db_config.connect(conn);

// 멤버 리스트 조회
router.get("/list", (_, res) => {
  var sql = "SELECT id, name, phone_number, address FROM member";
  conn.query(sql, (err, data) => {
    if (err) throw err;
    else res.json({ data: data, message: "SUCCESS" });
  });
});

// 멤버 생성
router.post("/upload", (req, res) => {
  const sql = "INSERT INTO member SET ?";
  conn.query(sql, req.body, (err) => {
    if (err) throw err;
    else res.status(200).json({ message: "SUCCESS" });
  });
});

router
  .route("/:id")
  //멤버 조회
  .get((req, res) => {
    const { id } = req.params;
    let sql = `SELECT * FROM member WHERE id LIKE '${id}'`;
    conn.query(sql, (err, data) => {
      if (err) throw err;
      else if (data.length === 0) {
        res.status(404).json({ message: "잘못된 요청입니다." });
      } else res.json({ data: data, message: "SUCCESS" });
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
