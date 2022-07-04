const path = require("path")
const rootDir = require("../utils/path")

const checkResult = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "resultsCheck.html"))
}

const userResults = (req, res, next) => {
  res.json({ message: "Your results here:" })
}

module.exports = {
  userResults,
  checkResult,
}
