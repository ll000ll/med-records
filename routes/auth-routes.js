const express = require("express")
const { body } = require("express-validator")

const authController = require("../controllers/auth-controller")
const isAuth = require("../middleware/isAuth")
const {validateUser} = require("../validations/userCreation")

const router = express.Router()

router.get("/signup", authController.getSignup)
router.post(
  "/signup",
  validateUser,
  authController.postSignup
)
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.get("/logout", isAuth, authController.logout)
router.get("/reset", authController.getReset)
router.post("/reset", authController.postReset)
router.get("/reset/:token", authController.getNewPassword)
router.post("/reset/:token", authController.postNewPassword)

module.exports = router
