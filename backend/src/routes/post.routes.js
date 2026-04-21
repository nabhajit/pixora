const express = require("express");
const postRouter = express.Router();
const { createPost, getter, postdetails, likePost, getFeed } = require("../controllers/post.controller");
const upload = require("../middlewares/multer");
const verification = require("../middlewares/verification");


postRouter.use(verification);

postRouter.get("/feed",               getFeed);              // all posts, all users
postRouter.post("/create",  upload.single("image"), createPost);
postRouter.get("/getall",             getter);               // only my posts
postRouter.get("/details/:postId",    postdetails);
postRouter.post("/like/:postId",       likePost);

module.exports = postRouter;