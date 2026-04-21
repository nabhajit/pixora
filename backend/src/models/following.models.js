const mongoose = require("mongoose");

const followingScheme = new mongoose.Schema({
    follower:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Follower is required"]
    },
    following:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Following is required"] 
    }
})


module.exports = mongoose.model("Following",followingScheme);