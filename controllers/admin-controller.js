const path = require("path")

const rootDir = require("../utils/path")
const { User } = require("../models/user")
const HttpError = require("../models/http-error")
const deleteFile = require("../utils/fileDeletion")

const getIndex = async (req, res, next) => {
  res
    .status(200)
    .render("adminDefault", { isAdmin: true, activeClassSearch: true })
}

const postIndex = async (req, res, next) => {
  const { nationalId, email, accessLevel } = req.body
  let emptyResultSet
  let searchFilter
  if (!nationalId && !email && !accessLevel) {
    emptyResultSet = true
  } else {
    if (nationalId) {
      searchFilter = { nationalId }
    }
    if (email) {
      searchFilter = { ...searchFilter, email }
    }
    if (accessLevel) {
      searchFilter = { ...searchFilter, accessLevel }
    }
  }
  let usersFound
  try {
    usersFound = searchFilter && (await User.find(searchFilter).lean())
  } catch (err) {
    const error = new HttpError("Could not get the users.", 500)
    return next(error)
  }

  res.status(200).render("adminDefault", {
    emptyResultSet,
    isAdmin: true,
    activeClassSearch: true,
    hasUsers: usersFound?.length > 0,
    users: usersFound,
  })
}

const getAllUsers = async(req, res, next) => {
  let allUsers
  try {
    allUsers = await User.find({}).lean()
  } catch (err) {
    const error = new HttpError("Could not get all the users.", 500)
    return next(error)
  }
  res.render("userResultData", {
    hasUsers: allUsers.length > 0,
    users: allUsers,
    activeClassList: true,
    isAdmin: true
  })
}

const getCreateUser = (req, res, next) => {
  res.status(200).render("createOrUpdateUser", {
    editMode: false,
    isAdmin: true,
    activeClassAdd: true,
  })
}

const postCreateUser = async (req, res, next) => {
  const { nationalId, email = "", password, accessLevel } = req.body
  const userFile = req.file
  if (!userFile) {
    return res.render("createOrUpdateUser", {
      ...req.body,
      editMode: false,
      isAdmin: true,
      errorMessage: "Attached file is not supported",
    })
  }
  const docs = [req.file.path]
  const createdUser = new User({
    nationalId,
    password,
    email,
    accessLevel,
    docs,
  })

  try {
    await createdUser.save()
  } catch (err) {
    let error
    if (err) {
      error = new HttpError(
        "Creating user failed => duplicate key or missing required field.",
        500
      )
    } else {
      error = new HttpError("Creating user failed, please try again.", 500)
    }
    return next(error)
  }

  res.status(201).render("adminDefault", {
    pageTitle: "Create user",
    hasUsers: true,
    isAdmin: true,
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
  res.status(200).redirect("/admin")
}

const getLogin = (req, res, next) => {
  res.status(200).render("adminLogin")
}

const postEditUser = async (req, res, next) => {
  const _id = req.params.userId
  const newFileIsPresent = req.file?.path
  const docs = [newFileIsPresent]
  try {
    if (req.body?.docId) {
      delete req.body.docId
    }
    let updateFilter = newFileIsPresent
      ? { ...req.body, docs }
      : { ...req.body }
    const userBeforeUpdate = await User.findOneAndUpdate({ _id }, updateFilter)
    if (newFileIsPresent) {
      deleteFile.fileSweeper(userBeforeUpdate.docs[0])
    }
  } catch (err) {
    const error = new HttpError("Updating user failed, please try again.", 500)
    return next(error)
  }

  res.status(201).redirect(`/admin`)
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
    isAdmin: true,
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
    deleteFile.fileSweeper(req.body.docId)
  } catch (e) {
    const error = new HttpError("Cannot delete the user. Please try again", 500)
    return next(error)
  }

  res.status(204).redirect("/admin")
}

module.exports = {
  getIndex,
  getCreateUser,
  postCreateUser,
  getLogin,
  postLogin,
  postEditUser,
  getEditUser,
  deleteUser,
  postIndex,
  getAllUsers
}
