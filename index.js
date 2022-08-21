require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const URL = process.env.urlDB

//Mongoose Connection
mongoose
  .connect(URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database connnection established");
  })
  .catch((err) => console.log("Error- " + err.toString()));

//Using Routes
app.use(cors());
app.use(bodyParser.json());
app.use("/apis", routes);

const port = 8000;

app.get("/", (req, res) => {
  res.status(200).send({
    data: "Server is up and running",
    error: null,
    status: 200
  })
})

app.listen(port, () => {
  console.log("Application is listening to http://localhost:" + port + "/");
});
