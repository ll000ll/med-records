const path = require("path")

const rootDir = require("../utils/path")
const User = require("../models/user")
const HttpError = require("../models/http-error")
const deleteFile = require("../utils/fileDeletion")

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
  const { nationalId, email = "", password, accessLevel } = req.body
  const userFile = req.file
  if (!userFile) {
    return res.render("createOrUpdateUser", {
      ...req.body,
      editMode: false,
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
      error = new HttpError(
        "Creating user failed, please try again.",
        500
      )
    }
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
  const _id = req.params.userId
  const docs = [req.file?.path]

  let updatedUser
  try {
    const fileToUpdatePresent = req.file?.path
    const valuesToUpdate = fileToUpdatePresent
      ? { ...req.body, docs }
      : { ...req.body }
    const userBeforeUpdate = await User.findOneAndUpdate(
      { _id },
      valuesToUpdate
    )
    updatedUser = await User.findById(_id).lean()
    deleteFile.fileSweeper(userBeforeUpdate.docs[0])
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
  deleteFile.fileSweeper(req.body.docId)
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
