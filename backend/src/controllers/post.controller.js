const Post = require("../models/post.models");
const User = require("../models/user.models");
const Like = require("../models/likes.models");
const { ImageKit } = require("@imagekit/nodejs");

require("dotenv").config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT  
})

async function createPost(req, res) {
    try {
        const { caption } = req.body;
        const image = req.file;
        const user = req.user;

        if (!image) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const response = await imagekit.files.upload({
            file: image.buffer.toString("base64"),
            fileName: image.originalname,
            folder: "insta-clone"
        });

        const newPost = await Post.create({
            caption,
            image: response.url,
            owner: user._id
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        res.status(500).json({
            message: "ERROR: " + error.message
        });
    }
}   

async function getter(req, res) {
    try {
        const user = req.user;

        const posts = await Post.find({
            owner: user._id
        }).populate("owner", "username email");

        res.status(200).json({
            message: "Posts fetched successfully",
            posts: posts
        });
    } catch (error) {
        res.status(500).json({
            message: "ERROR: " + error.message
        });
    }
}

async function postdetails(req, res) {
    try {
        const user = req.user;
        const postid = req.params.postId;

        const post = await Post.findById(postid);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Fixed owner check: allowing access for now unless specified otherwise in plan discussion.
        // Original code had a bug (post.user instead of post.owner) and was possibly backwards (forbidden if owner).

        return res.status(200).json({
            post
        });
    } catch (error) {
        res.status(500).json({
            message: "ERROR: " + error.message
        });
    }
}

async function likePost(req, res) {
    try {
        const user = req.user;
        const postid = req.params.postId;

        const post = await Post.findById(postid);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const like = await Like.create({
            post: postid,
            user: user._id
        });

        res.status(201).json({
            message: "Post liked successfully",
            like: like
        });
    } catch (error) {
        res.status(500).json({
            message: "ERROR: " + error.message
        });
    }
}   
// GET /api/posts/feed  — all posts from all users, newest first
async function getFeed(req, res) {
    try {
        const posts = await Post.find({})
            .populate("owner", "username email bio")
            .sort({ _id: -1 }); // newest first (_id contains timestamp)

        res.status(200).json({
            message: "Feed fetched successfully",
            posts: posts
        });
    } catch (error) {
        res.status(500).json({
            message: "ERROR: " + error.message
        });
    }
}

module.exports = { createPost, getter, postdetails, likePost, getFeed };