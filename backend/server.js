require("dotenv").config(); 
const connection = require("./src/config/database");
const app = require("./src/app");

connection();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 