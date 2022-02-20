const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");

//Mongoose Connection
mongoose
  .connect("mongodb://localhost/CRUD", { useNewUrlParser: true })
  .then((body) => {
    console.log("Database connnection established");
  })
  .catch((err) => console.log("Error- " + err.toString()));

//Using Routes
app.use(cors());
app.use(bodyParser.json());
app.use("/apis", routes);

const port = 8000;

app.listen(port, () => {
  console.log("Application is listening to http://localhost:" + port + "/");
});
