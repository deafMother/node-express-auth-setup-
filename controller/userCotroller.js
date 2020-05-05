// handling user login, login status

const catchAsync = require("../uttil/catchAsync");
const AppError = require("../uttil/appError");
const routeController = require("./routeControllers");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Admin = require("../models/adminModel");

// the user can choose to keep loggend in or not option

exports.loginIn = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user =
    (await Student.findOne({ email }).select("+password")) ||
    (await Teacher.findOne({ email }).select("+password")) ||
    (await Admin.findOne({ email }).select("+password")); //+ means to select this field because in the schema selected is false

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(new AppError("Invalid email or password", 404)));
  }
  routeController.generateToken(user, 200, res, req);
});

// logout
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
    message: "loggen out successfully",
  });
});

// check login status
exports.checkLoginStatus = catchAsync(async (req, res, next) => {
  res.json({
    status: "success",
    message: "loggen in",
    data: {
      uer: req.user,
    },
  });
});
