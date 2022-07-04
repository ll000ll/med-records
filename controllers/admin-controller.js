const path = require("path")
const rootDir = require("../utils/path")

const HttpError = require("../models/http-error")

const getUsers = (req, res, next) => {
  res.json({ message: "list users view!" })
}

const createUsers = (req, res, next) => {
  res.json({ message: "create users  view" })
}

const postLogin = (req, res, next) => {
  const { email, password } = req.body

  // const identifiedUser = DUMMY_USERS.find(u => u.email === email)
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError('Could not identify user, credentials seem to be wrong.', 401)
  // }

  res.json({ message: "Logged in!" })
}

const getLogin = (req, res, next) => {
  res.json({ message: "some form to log in" })
}

module.exports = {
  getUsers,
  createUsers,
  getLogin,
  postLogin,
}
