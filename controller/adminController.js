// add new student and new teacher, update current sutdent ,teacher,

const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Admin = require("../models/adminModel");

const catchAsync = require("../uttil/catchAsync");

// only admin can access these handlers: protect(admin)

exports.createStudent = catchAsync(async (req, res, next) => {
  const student = await Student.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

// add  teacher
exports.createTeacher = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      teacher,
    },
  });
});

// add admin
exports.createAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});

// edit teacher, student
