const express = require("express")

const router = express.Router()
const adminController = require("../controllers/admin-controller")

router.get("/login", adminController.getLogin)
router.post("/login", adminController.postLogin)

router.get("/users", adminController.getUsers)
router.get("/users/createUser", adminController.getCreateUser)
router.post("/users/createUser", adminController.postCreateUser)
router.get("/users/:userId", adminController.getUser)
router.get("/users/edit/:userId", adminController.getEditUser)
router.post("/users/edit/:userId", adminController.postEditUser)
router.post("/users/delete/:userId", adminController.deleteUser)

module.exports = router
