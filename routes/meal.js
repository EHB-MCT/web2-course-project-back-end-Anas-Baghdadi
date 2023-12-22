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
    console.log("Connected to MongoDB"); // Connection success message
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err); // Connection error message
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

    res.status(201).json({ success: true, mealId: result.insertedId }); // Successful meal addition response
  } catch (error) {
    console.error("Error adding meal to database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" }); // Internal Server Error response
  }
});

// Route GET to retrieve all meals
router.get("/meals", async (req, res) => {
  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");

  try {
    const meals = await mealCollection.find({}).toArray();
    res.status(200).json(meals); // Successful retrieval of meals response
  } catch (error) {
    console.error(
      "Error retrieving meals from the database:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error response
  }
});

// Route DELETE to delete a meal by _id
router.delete("/:id", async (req, res) => {
  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");
  const mealId = req.params.id;

  try {
    const result = await mealCollection.deleteOne({
      _id: new ObjectId(mealId),
    });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Meal deleted successfully" }); // Successful meal deletion response
    } else {
      res.status(404).json({ success: false, error: "Meal not found" }); // Meal not found response
    }
  } catch (error) {
    console.error("Error deleting meal from the database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" }); // Internal Server Error response
  }
});

module.exports = router;
