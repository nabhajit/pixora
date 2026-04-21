const Following = require("../models/following.models");

async function follower(req, res) {
    try {
        const followerId = req.user._id;
        const { following: followingId } = req.body;

        if (!followingId) {
            return res.status(400).json({
                message: "Following ID is required"
            });
        }

        if (followerId.toString() === followingId.toString()) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const existingFollow = await Following.findOne({
            follower: followerId,
            following: followingId
        });

        if (existingFollow) {
            await Following.findByIdAndDelete(existingFollow._id);
            return res.status(200).json({
                message: "Unfollowed successfully"
            });
        } else {
               const newFollow = new Following({
                follower: followerId,
                following: followingId
            });
            await newFollow.save();
            return res.status(201).json({
                message: "Followed successfully",
                data: newFollow
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Error - " + error.message
        });
    }
}

async function getFollowData(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Get followers: people who are following the target userId
        const followers = await Following.find({ following: userId })
            .populate("follower", "username profile_pic bio");

        // Get following: people who the target userId is following
        const following = await Following.find({ follower: userId })
            .populate("following", "username profile_pic bio");

        res.status(200).json({
            message: "Follow data fetched successfully",
            data: {
                followersCount: followers.length,
                followingCount: following.length,
                followers: followers.map(f => f.follower),
                following: following.map(f => f.following)
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error - " + error.message
        });
    }
}

module.exports = { follower, getFollowData };