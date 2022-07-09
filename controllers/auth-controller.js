const bcrypt = require("bcryptjs")

const HttpError = require("../models/http-error")
const { SuperUser } = require("../models/user")

const getSignup = (req, res, next) => {
  res.status(200).render("login", { submitView: true, isAdminView: true })
}

const getLogin = (req, res, next) => {
  res.status(200).render("login", { isAdminView: true })
}

const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body

  try {
    const credentialExists = await SuperUser.findOne({ email })
    if (credentialExists) {
      return res.redirect("/admin/login", {
        submitView: true,
        isAdminView: true,
      })
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const newUser = new SuperUser({ email, password: hashedPassword })
      await newUser.save()
    }
  } catch (err) {
    let error
    if (err) {
      error = new HttpError("Creating user failed", 500)
    } else {
      error = new HttpError("Creating user failed, please try again.", 500)
    }
    return next(error)
  }
  res.status(200).render("adminDefault", { isAdmin: true })
}

const postLogin = async (req, res, next) => {
  const { email, password } = req.body
  let existingUser
  try {
    existingUser = await SuperUser.findOne({ email })
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
  const passwordIsValid = await bcrypt.compare(password, existingUser.password)

  if (!passwordIsValid) {
    // const error = new HttpError(
    //   "Could not log you in, please check your credentials and try again.",
    //   500
    // )
    // return next(error)
    return res.render("login", { isAdminView: true })
  }
  req.session.isLoggedIn = true
  req.session.user = existingUser
  req.session.save()
  res.status(200).redirect("/admin")
}

const logout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/admin/login')
  })
}

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout
}
