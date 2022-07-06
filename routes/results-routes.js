const express = require("express")

const router = express.Router()
const resultsController = require("../controllers/results-controller")

router.get("/results", resultsController.getCheckResult)
router.post("/user-results", resultsController.postUserResults)
router.get("/user-results/data/:userFile", resultsController.getUserResultsFile)

module.exports = router
