const mongoose = require("mongoose")
// const {User} = require("./user.models") 

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        required:true,
        default:"Hello here is your new post"
    },
    image:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" , 
        required:true
    }
})  

module.exports = mongoose.model("Post",postSchema); 