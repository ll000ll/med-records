const express = require("express")

const router = express.Router()
const adminController = require("../controllers/admin-controller")

router.get("/login", adminController.getLogin)
router.post("/login", adminController.postLogin)

router.get("/", adminController.getIndex)
router.post("/", adminController.postIndex)
router.get("/users/list", adminController.getAllUsers)
router.get("/users/create", adminController.getCreateUser)
router.post("/users/create", adminController.postCreateUser)
router.get("/users/edit/:userId", adminController.getEditUser)
router.post("/users/edit/:userId", adminController.postEditUser)
router.post("/users/delete/:userId", adminController.deleteUser)

module.exports = router
