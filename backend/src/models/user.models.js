const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio:{
        type: String,
        default: "Hello world"
    } ,
    profile_pic:{
        type: String,
        default: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kingston"    
    } 
});

module.exports = mongoose.model("User", userSchema);    