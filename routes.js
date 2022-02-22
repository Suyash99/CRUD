const express = require("express");
const app = express.Router();
const {
  createMongo,
  findAlldMongo,
  readOneMongo,
  updateMongo,
  deleteMongo,
  idChecker,
  existsInDBCheck,
} = require("./mongoOperations");

app.post("/create", idChecker, createMongo);
app.get("/fetchAll", findAlldMongo);
app.get("/read", existsInDBCheck, readOneMongo);
app.put("/update", existsInDBCheck, updateMongo);
app.delete("/delete", existsInDBCheck, deleteMongo);

module.exports = app;
