const express = require("express")

const router = express.Router()
const adminController = require("../controllers/admin-controller")
const isAuth = require("../middleware/isAuth")

router.get("/", isAuth, adminController.getIndex)
router.post("/", isAuth, adminController.postIndex)
router.get("/users/list", isAuth, adminController.getAllUsers)
router.get("/users/create", isAuth, adminController.getCreateUser)
router.post("/users/create", isAuth, adminController.postCreateUser)
router.get("/users/edit/:userId", isAuth, adminController.getEditUser)
router.post("/users/edit/:userId", isAuth, adminController.postEditUser)
router.post("/users/delete/:userId", isAuth, adminController.deleteUser)

module.exports = router
