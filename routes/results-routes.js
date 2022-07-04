const express = require("express")

const router = express.Router()
const resultsController = require("../controllers/results-controller")

router.get("/results", resultsController.checkResult)
router.post("/user-results", resultsController.userResults)

module.exports = router
