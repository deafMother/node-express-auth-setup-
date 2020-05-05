const express = require("express");
const router = express.Router();

const testController = require("../controller/testController");

router
  .route("/:testId?")
  .get(testController.viewTest)
  .post(testController.creareTest);

module.exports = router;
