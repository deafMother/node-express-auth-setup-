const userController = require("../controller/userCotroller");
const routeController = require("../controller/routeControllers");

const express = require("express");
const router = express.Router();

router
  .route("/login")
  .post(userController.loginIn)
  .get(routeController.protect, userController.checkLoginStatus);

router.route("/logout").get(userController.logout);

module.exports = router;
