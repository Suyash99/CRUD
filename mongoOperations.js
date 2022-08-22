const mongoose = require("mongoose");
const Student = require("./schema");

//CRUD Operations
const counterService = async () => {
  let dbEntry = await Student.find({}).sort({ _id: 1 }).limit(10)
  console.log(dbEntry)
  return typeof dbEntry == "object" && dbEntry.length == 0 ? 1 : dbEntry?.[0]?.idNumber
}

const createMongo = async (req, res) => {
  const student = new Student(req.body);
  let idCounter = await counterService()

  if (!idCounter) {
    return res.status(500).json({
      data: null,
      error: "Some error getting idNumber Counter-",
      status: 500
    })
  }

  //Assigning Counter to idNumber
  req.body.idNumber = idCounter
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

const findAlldMongo = (req, res) => {
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

const readOneMongo = (req, res) => {
  Student.findOne({ idNumber: req.query.id }).exec((err, found) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err.message,
      });
    } else {
      if (found == null) {
        return res.status(400).json({
          data: null,
          error: req.query.id + " _id doesnt exist in DB!",
        });
      }
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

const updateMongo = (req, res) => {
  if (req.query.id != undefined) {
    var _id = req.query.id;
  } else {
    return res.status(400).json({
      data: null,
      error: "Query parameter is not provided!",
    });
  }
  const updatedVal = req.body;
  Student.updateOne({ idNumber: _id }, { $set: updatedVal }).exec(
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

const deleteMongo = (req, res) => {
  if (req.query.id != undefined) {
    var _id = req.query.id;
  } else {
    res.status(400).json({
      data: null,
      error: "Query Parameter is not provided!",
    });
  }
  Student.deleteOne({ idNumber: _id }).exec((err, deleteRes) => {
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
const existsInDBCheck = async (req, res, next) => {
  if (req.query.id) {
    Student.findById(req.query.id).exec((err, found) => {
      if (err) {
        res.status(400).json({
          data: null,
          error: "Internal Server error- " + err.message,
          status: 400
        });
      } else if (!found) {
        res.status(400).json({
          data: null,
          error: req.query.id + " id not found in DB!",
          status: 400
        });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({
      data: null,
      error: "Query parameter id is not provided properly!",
    });
  }
};

module.exports = {
  existsInDBCheck: existsInDBCheck,
  createMongo: createMongo,
  findAlldMongo: findAlldMongo,
  readOneMongo: readOneMongo,
  updateMongo: updateMongo,
  deleteMongo: deleteMongo
}
