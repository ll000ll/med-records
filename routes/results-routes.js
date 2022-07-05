const express = require("express")

const router = express.Router()
const resultsController = require("../controllers/results-controller")

router.get("/results", resultsController.getCheckResult)
router.post("/user-results", resultsController.postUserResults)

module.exports = router
