const mongoose = require("mongoose");

function connection(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("ERROR: " + error.message);
    });     
}

module.exports = connection;