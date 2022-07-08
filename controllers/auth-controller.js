const { User } = require("../models/user")

const getSignup = (req, res, next) => {
  res.render("login", { submitView: true, isAdminView: true })
}

const getLogin = (req, res, next) => {
  res.status(200).render("login", { isAdminView: true })
}

const postSignup = (req, res, next) => {
    res.status(200).render("adminDefault", { isAdminView: true })
}

module.exports = {
  getSignup,
  postSignup,
  getLogin,
}
