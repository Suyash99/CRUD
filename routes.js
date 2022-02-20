const express = require("express");
const app = express.Router();
const {
  createMongo,
  findAlldMongo,
  readOneMongo,
  updateMongo,
  deleteMongo,
  idChecker,
} = require("./mongoOperations");

app.post("/create", idChecker, createMongo);
app.get("/fetchAll", findAlldMongo);
app.get("/read", readOneMongo);
app.put("/update", updateMongo);
app.delete("/delete", deleteMongo);

module.exports = app;
