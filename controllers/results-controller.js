const path = require("path")
const fs = require("fs")

const HttpError = require("../models/http-error")
const rootDir = require("../utils/path")
const User = require("../models/user")

const getUserLogin = (req, res, next) => {
  res.status(200).render("userLogin")
}

const postUserResults = async (req, res, next) => {
  const { nationalId, password } = req.body
  if (!nationalId || !password) {
    return res
      .status(404)
      .render("userLogin", {
        errorMessage: "Please make sure you've entered the correct credentials",
      })
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

  res.status(200).render("userResultData", {
    hasUsers: true,
    pageTitle: "Results",
    users: [
      {
        ...userResult,
      },
    ],
  })
}

const getUserResultsFile = (req, res, next) => {
  const fileName = req.params.userFile
  const filepath = path.join("data", `${fileName}`)
  if (fs.existsSync(filepath)) {
    const file = fs.createReadStream(filepath)
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`)
    file.pipe(res)
    // read sync in memory
    // return fs.readFile(filepath, (err, data) => {
    //   if (err) {
    //     return next(err)
    //   }
    //   res.setHeader('Content-Type', 'application/pdf')
    //   res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
    //   res.send(data)
    // })
    return
  }
  res.status(500).render("500", { pageTitle: "Not found", message: "File not found. :-("})



}

module.exports = {
  postUserResults,
  getUserLogin,
  getUserResultsFile,
}
