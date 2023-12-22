const { MongoClient } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const loginRoute = require("./routes/login.js");
const mealRoute = require("./routes/meal.js");

const app = express();
const port = process.env.PORT || 4000;

const url =
  process.env.MONGODB_URI ||
  "mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/mealPlanItems?retryWrites=true&w=majority";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the MongoDB database
let dbClient;

async function connectToDatabase() {
  try {
    await client.connect();
    dbClient = client;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
}

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  if (!dbClient) {
    await connectToDatabase();
  }
  req.dbClient = dbClient;
  next();
});

// Middleware for parsing JSON and handling CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/user", loginRoute);
app.use("/meal", mealRoute);

// Close the database connection when the server is closed
process.on("SIGINT", async () => {
  if (dbClient) {
    await dbClient.close();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
