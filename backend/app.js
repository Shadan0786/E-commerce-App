require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");


const app = express();

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`server is running on a port ${PORT}`)
})