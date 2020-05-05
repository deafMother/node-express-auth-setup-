// issues: once a test is submitted : store the result is the result collection

// use aggregation pipelline to calculate the result and the save it
// when a teacher or student takes a test, once submitted it has to be handled by this handler

/*
    {
        testId: xxxxx,
        answers:[
            {questionId:1223, answer: "s"},
            {},
            {}
        ]
    }

*/

const Result = require("../models/resultModel");
const Test = require("../models/testModel");
const AppError = require("../uttil/appError");
const catchAsync = require("../uttil/catchAsync");

exports.calculateResult = catchAsync(async (req, res, next) => {
  let result = 0;
  const { _id } = req.user;
  const { testId, answers } = req.body;

  // prevernt a resubmit for the same test
  const previousResult = await Result.findOne({ testId, userId: _id });

  if (previousResult) {
    return next(new AppError("This test is already submitted", 404));
  }

  const test = await Test.findById(testId);
  if (!test) {
    return next(new AppError("Invalid test", 404));
  }
  const testQuestions = test.questions;

  testQuestions.forEach((question) => {
    for (let i = 0; i < answers.length; i++) {
      if (
        question.answer === answers[i].answer &&
        String(question._id) === answers[i].questionId
      ) {
        result++;
        break;
      }
    }
  });
  console.log(result);
  // save the result to the  result collection, also update the database of the sudent or teacher who has taken the test
});
