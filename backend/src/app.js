const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const followRouter = require("./routes/follow.routes");
const userRouter = require("./routes/user.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/follower", followRouter);
app.use("/api/user", userRouter);

module.exports = app;