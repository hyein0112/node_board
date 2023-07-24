const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const membersRouter = require("./routes/members");
const authRouter = require("./routes/auth");
const boardRouter = require("./routes/board");

const app = express();

// db 연결
let db_config = require("./config/database");
let conn = db_config.init();
db_config.connect(conn);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/members", membersRouter);
app.use("/board", boardRouter);

app.listen(3000);
