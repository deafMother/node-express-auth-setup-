const express = require("express");
const router = express.Router();

const resultController = require("../controller/resultController");

router.route("/:testId?").get().post(resultController.calculateResult);

module.exports = router;
