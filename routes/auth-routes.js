const express = require("express")

const router = express.Router()
const authController = require("../controllers/auth-controller")
const isAuth = require("../middleware/isAuth")

router.get("/signup", authController.getSignup)
router.post("/signup", authController.postSignup)
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.get("/logout", isAuth, authController.logout)

module.exports = router
