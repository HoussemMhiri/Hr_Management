const express = require("express");
const connectDB = require("./config/connectDB");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");

connectDB();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.listen(PORT, (err) =>
    err
      ? console.log(err)
      : console.log(`Server in connected successfully on Port ${PORT}`)
  );
  