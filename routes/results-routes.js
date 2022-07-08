const express = require("express")

const router = express.Router()
const resultsController = require("../controllers/results-controller")

router.get("/login", resultsController.getUserLogin)
router.post("/results", resultsController.postUserResults)
router.get("/results/data/:userFile", resultsController.getUserResultsFile)

module.exports = router
