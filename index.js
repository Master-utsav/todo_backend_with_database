const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./utils/dbConnect.js")
const userRoute = require("./router/userRoute.js");
const authRoute = require('./router/authRoute.js');
const {authenticateToken} = require("./middleware/authMiddleware.js");
const cors = require("cors");
dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT | 8000;

app.use(cors());
app.use(express.json());

app.use("/todos", authenticateToken ,userRoute);
app.use("/user" , authRoute);

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(PORT , () => {
    console.log("server started at PORT : " + PORT + " 🚀...")
})
