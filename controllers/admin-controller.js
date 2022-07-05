const path = require("path")

const rootDir = require("../utils/path")
const User = require("../models/user")
const HttpError = require("../models/http-error")

const getUsers = async (req, res, next) => {
  let allUsers
  try {
    allUsers = await User.find({}).lean()
  } catch (err) {
    const error = new HttpError("Could not get all the users.", 500)
    return next(error)
  }
  res.render("userData", { hasUsers: allUsers.length > 0, users: allUsers, render: 'Users List' })
}

const getCreateUser = (req, res, next) => {
  res.status(200).sendFile(path.join(rootDir, "views", "createUser.html"))
}

const postCreateUser = async (req, res, next) => {
  const { nationalId, email = '111111@w1111.com', password, docs = [] } = req.body
  console.log(req.body)
  const createdUser = new User({
    email,
    password,
    nationalId,
    docs,
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again.", 500)
    return next(error)
  }

  res.status(201).render("userData", {
    pageTitle: "Create user",
    hasUsers: true,
    users: [
      {
        nationalId,
        password,
        email,
        docs,
      },
    ],
  })
}

const postLogin = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    const error = new HttpError("Login failed. Please try again later.", 500)
    return next(error)
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    )
    return next(error)
  }

  if (existingUser.password !== password) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    )
    return next(error)
  }

  res.json({ message: `Hi ${email}` })
}

const getLogin = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "login.html"))
}

module.exports = {
  getUsers,
  getCreateUser,
  postCreateUser,
  getLogin,
  postLogin,
}
