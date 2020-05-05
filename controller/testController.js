const Test = require("../models/testModel");
const AppError = require("../uttil/appError");
const catchAsync = require("../uttil/catchAsync");

// only teachers can create tests: protected
exports.creareTest = catchAsync(async (req, res, next) => {
  const test = await Test.create(req.body);

  res.status(200).json({
    status: "success",
    test,
  });
});

// teachers and students can take test, teachers can also view test
exports.viewTest = catchAsync(async (req, res, next) => {
  const { testId } = req.params;

  const test = await Test.findById(testId).select({
    "questions.answer": 0,
  });

  if (!test) {
    return next(new AppError("Test not found", 404));
  }

  res.json({
    status: "success",
    test,
  });
});

// edit a test: protected (teacher)
exports.editTest = catchAsync(async (req, res, next) => {});
