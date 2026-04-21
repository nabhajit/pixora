const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


async function registerUser(req,res){

    try{
        const {username ,email ,password} = req.body;
        
        const exist = await User.findOne({
            $or:[
                {username:username},
                {email:email}
                ]
        })
        if(exist){
            return res.status(400).json({
                message:"ERROR: User already exists"
            })
        }
        const hashed = crypto.createHash("md5").update(password).digest("hex");
        const user = await User.create({
            username,
            email,
            password: hashed
        })
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.status(200).json({
            message:"User registered successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"ERROR: " + error.message
        })
    }
}

async function loginUser(req,res){
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"ERROR: Please provide email and password"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"ERROR: User not found"
            })
        }

        const hashed = crypto.createHash("md5").update(password).digest("hex");
        if(user.password !== hashed){
            return res.status(400).json({
                message:"ERROR: Incorrect password"
            })
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.status(200).json({
            message:"User logged in successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"ERROR: " + error.message
        })
    }
}

module.exports = {registerUser,loginUser};