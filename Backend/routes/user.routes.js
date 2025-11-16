const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const useController = require("../controllers/user.controller");

// User registration route with validation

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  useController.registerUser
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Invalid email address")],
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  useController.loginUser
);

module.exports = router;
