// all necessary middleware like protect, restrict, set cookie, check token
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); // neede to promisify a function
const AppError = require("../uttil/appError");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Admin = require("../models/adminModel");
const catchAsync = require("../uttil/catchAsync");

const checkUser = async (id) => {
  const user =
    (await Student.findById(id)) ||
    (await Teacher.findById(id)) ||
    (await Admin.findById(id));
  return user;
};

// / check authentication/jwt token status: used in protecting routes and login status of user
const checkTokenStatus = async (req, next, fetchUsers = false) => {
  let token;
  // // 1) check if the token exists, i.e  has been send in the request
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // } else if (req.session) {
  //   token = req.session.jwt;
  // }

  if (req.cookies) {
    token = req.cookies.jwt;
  }

  if (fetchUsers && !token) {
    // this is the case use when fetching all users by not logged in users
    return;
  }

  if (!token) {
    return next(
      new AppError("Authentication failed, Please login in to gain access", 401)
    );
  }

  // 2) validate the user of the token still exists in the database
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if the user still exists

  const freshUser = await checkUser(decoded.id);
  console.log(freshUser);
  if (!freshUser) {
    return next(new AppError("The User of this token has been deleted", 401));
  }
  req.user = freshUser;
};

// sign the jwt token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const setCookie = (res, token) => {
  res.cookie("jwt", token, {
    sameSite: false,
    httpOnly: true,
    maxAge: 900000000,
    secure: false,
  });
};

// generate the jwt token
exports.generateToken = (user, statusCode, res, req) => {
  let token = signToken(user.id);
  setCookie(res, token);
  user.password = undefined; // remove the password from the response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// use for protecting routes
exports.protect = catchAsync(async (req, res, next) => {
  await checkTokenStatus(req, next);
  if (req.user) {
    next();
  }
});

// restrict routes
exports.restrict = (allowedUsers) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.user.role);
    if (!allowedUsers.includes(req.user.role)) {
      return next(
        new AppError("You do not have the permission to this route", 404)
      );
    }
    next();
  });
};
