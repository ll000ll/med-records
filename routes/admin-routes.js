const express = require("express")

const router = express.Router()
const adminController = require("../controllers/admin-controller")

router.get("/login", adminController.getLogin)
router.post("/login", adminController.postLogin)

router.get("/users", adminController.getUsers)
router.get("/createUser", adminController.getCreateUser)
router.post("/createUser", adminController.postCreateUser)

module.exports = router
