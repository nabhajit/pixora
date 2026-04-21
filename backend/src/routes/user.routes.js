const express = require("express")
const { followuserController, unfollowuser, getAllUsers, getMe } = require("../controllers/user.controller")
const userRouter = express.Router()
const identification = require("../middlewares/verification")

userRouter.get("/me",identification, getMe)
userRouter.get("/all",identification, getAllUsers)
userRouter.post("/follow/:userId",   identification, followuserController)
userRouter.post("/unfollow/:userId", identification, unfollowuser)

module.exports = userRouter;