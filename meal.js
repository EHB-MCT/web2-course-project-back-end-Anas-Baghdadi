const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const { ObjectId } = require("mongodb");

// Connection URL for MongoDB
const mongoUrl =
  "mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/mealPlanItems?retryWrites=true&w=majority";

// Establishing connection to MongoDB
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

// Applying middleware for Cross-Origin Resource Sharing (CORS)
router.use(cors());

// Applying middleware to parse JSON in the request body
router.use(express.json());

// POST route to add a meal
router.post("/", async (req, res) => {
  // Destructuring values from the request body
  const { name, description, calories, userId } = req.body;

  // Accessing the MongoDB collection for meals
  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");

  try {
    // Inserting a new meal into the collection
    const result = await mealCollection.insertOne({
      name: name,
      description: description,
      calories: calories,
      userId: userId,
    });

    // Sending a success response with the inserted meal's ID
    res.status(201).json({ success: true, mealId: result.insertedId });
  } catch (error) {
    // Handling errors during the meal insertion
    console.error("Error adding meal to database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route GET to retrieve all meals
router.get("/meals", async (req, res) => {
  // Accessing the MongoDB collection for meals
  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");

  try {
    // Retrieving all meals from the collection and sending them in the response
    const meals = await mealCollection.find({}).toArray();
    res.status(200).json(meals);
  } catch (error) {
    // Handling errors during the retrieval of meals
    console.error("Error retrieving meals from database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route DELETE to delete a meal by _id
router.delete("/:id", async (req, res) => {
  // Accessing the MongoDB collection for meals
  const mealCollection = req.dbClient.db("mealPlanItems").collection("meals");

  // Extracting mealId from the request parameters
  const mealId = req.params.id;

  try {
    // Deleting a meal from the collection by _id
    const result = await mealCollection.deleteOne({
      _id: new ObjectId(mealId),
    });

    // Sending a success response if a meal was deleted
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Meal deleted successfully" });
    } else {
      // Sending an error response if no meal was found for deletion
      res.status(404).json({ success: false, error: "Meal not found" });
    }
  } catch (error) {
    // Handling errors during the deletion of a meal
    console.error("Error deleting meal from database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
