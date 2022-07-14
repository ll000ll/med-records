const { body } = require("express-validator")

exports.validateUser = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Pls enter a valid email"),
  body("password")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Pls enter a valid password"),
  body("confirmPassword")
    .isString()
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password")
      }
      return true
    }),
]
