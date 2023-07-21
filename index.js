const express = require("express");
const cors = require("cors");
const membersRouter = require("./routes/members");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/members", membersRouter);

app.listen(3000);
