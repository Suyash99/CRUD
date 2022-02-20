const mongoose = require("mongoose");
const Student = require("./schema");

exports.createMongo = (req, res) => {
  const student = new Student(req.body);

  student.save((err, body) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err.message,
      });
    } else {
      body.createdAt = undefined;
      body.updatedAt = undefined;
      body.__v = undefined;
      body._id = undefined;
      res.status(200).json({
        data: body,
        error: null,
      });
    }
  });
};

exports.findAlldMongo = (req, res) => {
  Student.find().exec((err, data) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err,
      });
    } else {
      res.status(200).json({
        data: data,
        error: null,
      });
    }
  });
};

exports.readOneMongo = (req, res) => {
  Student.findById({ _id: req.query.id }).exec((err, found) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err.message,
      });
    } else {
      found._id = undefined;
      found.createdAt = undefined;
      found.updatedAt = undefined;
      found.__v = undefined;
      res.status(200).json({
        data: found,
        error: null,
      });
    }
  });
};

exports.updateMongo = (req, res) => {
  if (req.query.id != undefined) {
    var _id = req.query.id;
  } else {
    return res.status(400).json({
      data: null,
      error: "Query parameter is not provided!",
    });
  }
  const updatedVal = req.body;
  Student.updateOne({ _id: _id }, { $set: updatedVal }).exec(
    (err, studentVal) => {
      if (err) {
        res.status(400).json({
          data: null,
          error: err,
        });
      } else {
        studentVal._id = undefined;
        studentVal.createdAt = undefined;
        studentVal.updatedAt = undefined;
        studentVal.__v = undefined;
        res.status(200).json({
          data: studentVal,
          error: null,
        });
      }
    }
  );
};

exports.deleteMongo = (req, res) => {
  if (req.query.id != undefined) {
    var _id = req.query.id;
  } else {
    res.status(400).json({
      data: null,
      error: "Query Parameter is not provided!",
    });
  }
  Student.deleteOne({ _id: _id }).exec((err, deleteRes) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err,
      });
    } else {
      res.status(200).json({
        data: deleteRes,
        error: null,
      });
    }
  });
};

//MiddleWare
exports.idChecker = async (req, res, next) => {
  let flag = false;
  Student.findOne({ idNumber: req.body.idNumber }).exec((err, idFound) => {
    if (idFound) {
      flag = true;
      return res.status(400).json({
        data: null,
        error:
          "ID Number " +
          req.body.idNumber +
          " is already associated with another student!",
      });
    }
  });
  flag ? next() : "";
};
