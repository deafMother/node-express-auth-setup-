const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "test id must be provided to result"],
    // ref: "Test",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user id must be provided to result"],
  },
  resultDate: {
    type: Date,
    default: Date.now,
  },
  testDate: {
    type: Date,
    default: Date.now,
  },
  result: {
    type: String,
    required: [true, "the result of the test must be provided"],
  },
});

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
