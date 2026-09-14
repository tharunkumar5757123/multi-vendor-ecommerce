const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app.js");
const connectDB=require("./src/config/db.js")

const port = process.env.PORT || 5000;
connectDB()

app.listen(port, () => {
    console.log("Server is running on " + port);
});