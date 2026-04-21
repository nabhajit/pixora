const express = require("express")
const followRouter = express.Router();
const {follower, getFollowData} = require("../controllers/follow.controllers")
const verification = require("../middlewares/verification")

followRouter.post("/follow", verification, follower)
followRouter.get("/data/:userId", getFollowData)


module.exports = followRouter;