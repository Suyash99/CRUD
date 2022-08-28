const Student = require("./schema");

//CRUD Operations
const counterService = async () => {
  let dbEntry = await Student.find({}).sort({ _id: -1 }).limit(1);

  return typeof dbEntry == "object" && dbEntry.length == 0
    ? 1
    : dbEntry[0].idNumber;
};

const createMongo = async (req, res) => {
  let idCounter = await counterService();
  
  if (!idCounter) {
    return res.status(500).json({
      data: null,
      error: "Some error getting idNumber Counter- " + idCounter,
      status: 500,
    });
  }

  //Assigning Counter to idNumber
  req.body.idNumber = idCounter + 1;

  const student = new Student(req.body);

  student.save((err, body) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err.message,
      });
    } else {
      res.status(200).json({
        data: {
          idNumber: body.idNumber,
          name: body.name,
          lastName: body.lastName,
          email: body.email,
        },
        error: null,
        status: 200,
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
        status: 400,
      });
    } else {
      res.status(200).json({
        data: data,
        error: null,
        status: 200,
      });
    }
  });
};

const readOneMongo = (req, res) => {
  Student.findOne({ idNumber: req.query.id }).exec((err, found) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: "Error reading idNumber- " + err.message,
        status: 400,
      });
    } else {
      if (found == null) {
        return res.status(400).json({
          data: null,
          error: req.query.id + " Id Number doesnt exist in DB!",
          status: 400,
        });
      }
      found._id = undefined;
      found.createdAt = undefined;
      found.updatedAt = undefined;
      found.__v = undefined;
      res.status(200).json({
        data: found,
        error: null,
        status: 200,
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
      status: 400,
    });
  }
  const updatedVal = req.body;
  Student.updateOne({ idNumber: _id }, { $set: updatedVal }).exec(
    (err, studentVal) => {
      if (err) {
        res.status(400).json({
          data: null,
          error: err,
          status: 400,
        });
      } else {
        studentVal._id = undefined;
        studentVal.createdAt = undefined;
        studentVal.updatedAt = undefined;
        studentVal.__v = undefined;
        res.status(200).json({
          data: studentVal,
          error: null,
          status: 200,
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
      status: 400,
    });
  }
  Student.deleteOne({ idNumber: _id }).exec((err, deleteRes) => {
    if (err) {
      res.status(400).json({
        data: null,
        error: err,
        status: 400,
      });
    } else {
      res.status(200).json({
        data: deleteRes,
        error: null,
        status: 200,
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
          status: 400,
        });
      } else if (!found) {
        res.status(400).json({
          data: null,
          error: req.query.id + " id not found in DB!",
          status: 400,
        });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({
      data: null,
      error: "Query parameter id is not provided properly!",
      status: 400,
    });
  }
};

const emailUniqueCheck = async (req, res, next) => {
  //Deprecated
  if (req.body.email) {
    let entryCheck = await Student.findOne({ email: req.body.email });

    if (entryCheck) {
      return res.status(409).json({
        data: null,
        error: req.body.email + " mail already exists in db!",
        status: 409,
      });
    }
    next();
  } else {
    res.status(400).json({
      data: null,
      error: "Email is not provided in the mail body",
      status: 400,
    });
  }
};

module.exports = {
  existsInDBCheck: existsInDBCheck,
  createMongo: createMongo,
  findAlldMongo: findAlldMongo,
  readOneMongo: readOneMongo,
  updateMongo: updateMongo,
  deleteMongo: deleteMongo,
};
