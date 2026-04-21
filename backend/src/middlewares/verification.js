const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

async function verification(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Token invalid"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    const user = await User.findById(decoded._id);

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized: No user found"
        });
    }

    req.user = user;
    next();
}

module.exports = verification;