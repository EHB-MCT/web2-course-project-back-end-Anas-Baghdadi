const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const { ObjectId } = require("mongodb");

// Connect to MongoDB
const mongoUrl =
  "mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/mealPlanItems?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

router.use(cors());
router.use(express.json());

module.exports = router;
