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
  res.render("userResultData", {
    adminView: true,
    hasUsers: allUsers.length > 0,
    users: allUsers,
    render: "Users List",
  })
}

const getCreateUser = (req, res, next) => {
  res.render("createOrUpdateUser", { editMode: false })
}

const postCreateUser = async (req, res, next) => {
  const { nationalId, email = "", password, docs = [] } = req.body

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

  res.status(201).render("userResultData", {
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

const getUser = async (req, res, next) => {
  const { userId } = req.params

  let existingUser

  try {
    existingUser = await User.findById(userId).lean()
  } catch (err) {
    const error = new HttpError("Cannot find this user.", 500)
    return next(error)
  }
  res.status(200).render("userResultData", {
    hasUsers: true,
    adminView: true,
    pageTitle: "User view",
    users: [
      {
        ...existingUser,
      },
    ],
  })
}

const postEditUser = async (req, res, next) => {
  const { nationalId, email = "", password, docs = [] } = req.body
  const _id = req.params.userId

  let updatedUser
  try {
    await User.findOneAndUpdate({ _id }, { ...req.body })
    updatedUser = await User.findById(_id).lean()
  } catch (err) {
    const error = new HttpError("Updating user failed, please try again.", 500)
    return next(error)
  }

  res.status(201).redirect(`/admin/users/${_id}`)
}

const getEditUser = async (req, res, next) => {
  const { userId } = req.params

  let user
  try {
    user = await User.findById(userId).lean()
  } catch (e) {
    const error = new HttpError("Cannot find the user in the db.", 500)
    return next(error)
  }
  res.status(200).render("createOrUpdateUser", {
    ...user,
    editMode: true,
  })
}

const deleteUser = async (req, res, next) => {
  const { userId } = req.params
  if (!userId) {
    const error = new HttpError("Cannot find the user. Not deleted", 500)
    return next(error)
  }

  try {
    await User.deleteOne({ _id: userId })
  } catch (e) {
    const error = new HttpError("Cannot delete the user. Please try again", 500)
    return next(error)
  }

  res.status(204).redirect("/admin/users")
}

module.exports = {
  getUsers,
  getCreateUser,
  postCreateUser,
  getLogin,
  postLogin,
  getUser,
  postEditUser,
  getEditUser,
  deleteUser,
}
