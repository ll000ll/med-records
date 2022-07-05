const path = require("path")

const HttpError = require("../models/http-error")
const rootDir = require("../utils/path")
const User = require("../models/user")

const getCheckResult = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "resultsCheck.html"))
}

const postUserResults = async (req, res, next) => {
  const { nationalId, password } = req.body
  if (!nationalId || !password) {
    return next(new HttpError("Please make sure you enter the correct credentials", 403))
  }

  let userResult
  try {
    userResult = await User.findOne({ nationalId: req.body.nationalId }).lean()
  } catch (e) {
    const err = new HttpError("Your result cannot be found", 400)
    return next(err)
  }

  if (userResult.password !== password) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    )
    return next(error)
  }

  res.status(200).render("userData", {
    hasUsers: true,
    pageTitle: "Results",
    users: [
      {
        ...userResult,
      },
    ],
  })
}

module.exports = {
  postUserResults,
  getCheckResult,
}
