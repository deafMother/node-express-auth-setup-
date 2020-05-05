// handle routes for logging in user, creating new users : note only admin can create new user

const adminController = require("../controller/adminController");
// const userController = require("../controller/userCotroller");
const routeController = require("../controller/routeControllers");

const express = require("express");
const router = express.Router();

// routes has to be protected, only admin can create routes

router.use(routeController.protect, routeController.restrict(["admin"]));
router.route("/").post(adminController.createAdmin);
router.route("/student").post(adminController.createStudent);
router.route("/teacher").post(adminController.createTeacher);

module.exports = router;
