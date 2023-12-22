const { MongoClient } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const loginRoute = require("./routes/login.js");
const mealRoute = require("./routes/meal.js");

const app = express();
const port = process.env.PORT || 4000;



app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});