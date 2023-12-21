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

// POST route to add a meal
router.post("/", async (req, res) => {
  const { name, description, calories, userId } = req.body;

  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");

  try {
    const result = await mealCollection.insertOne({
      name: name,
      description: description,
      calories: calories,
      userId: userId,
    });

    res.status(201).json({ success: true, mealId: result.insertedId });
  } catch (error) {
    console.error("Error adding meal to database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// GET route to retrieve all meals
router.get("/meals", async (req, res) => {
  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");

  try {
    const meals = await mealCollection.find({}).toArray();
    res.status(200).json(meals);
  } catch (error) {
    console.error("Error retrieving meals from database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
