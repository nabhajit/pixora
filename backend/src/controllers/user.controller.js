const followModel = require("../models/following.models")
const User = require("../models/user.models");


async function followuserController(req, res) {
    try {
        const id = req.user._id;           // fixed: was req.id
        const userId = req.params.userId;

        if (id.toString() === userId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }
        const isAlreadyFollowing = await followModel.findOne({ follower: id, following: userId });
        if (isAlreadyFollowing) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const follow = await followModel.create({ follower: id, following: userId });
        res.status(201).json({ message: "User followed successfully", data: follow });
    } catch (error) {
        res.status(500).json({ message: "ERROR: " + error.message });
    }
}

async function unfollowuser(req, res) {
    try {
        const id = req.user._id;           // fixed: was req.id
        const userId = req.params.userId;

        if (id.toString() === userId) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }
        const isAlreadyFollowing = await followModel.findOne({ follower: id, following: userId });
        if (!isAlreadyFollowing) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        await followModel.deleteOne({ follower: id, following: userId });
        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "ERROR: " + error.message });
    }
}

// GET /api/user/all  — returns all users except the current one
async function getAllUsers(req, res) {
    try {
        const me = req.user._id;
        const users = await User.find({ _id: { $ne: me } })
            .select("username email bio profile_pic")
            .lean();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "ERROR: " + error.message });
    }
}

// GET /api/user/me  — returns the current authenticated user info + id
async function getMe(req, res) {
    try {
        const user = req.user;
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profile_pic: user.profile_pic,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "ERROR: " + error.message });
    }
}

module.exports = { followuserController, unfollowuser, getAllUsers, getMe };