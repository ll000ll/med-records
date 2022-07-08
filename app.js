const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { engine } = require("express-handlebars")
const multer = require("multer")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const resultRoutes = require("./routes/results-routes")
const adminRoutes = require("./routes/admin-routes")
const HttpError = require("./models/http-error")

mongoose.Promise = global.Promise

require("dotenv").config()

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASS}@cluster0.tmcub.mongodb.net/${process.env.MONGODB_ATLAS_DBNAME}?retryWrites=true&w=majority`

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data")
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
})
const fileFilter = (req, file, cb) => {
  const supportedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "text/plain",
  ]
  if (supportedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const app = express()

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
)
app.set("view engine", "hbs")
app.set("views", "views")
app.use("/data", express.static(path.join(__dirname, "data")))
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter }).single("file"))

app.use("/admin", adminRoutes)
app.use(resultRoutes)

app.use((req, res, next) => {
  const error = new HttpError(
    "Could not find this route. Please check the address",
    404
  )
  next(error)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  // address Errors: ENOENT: no such file or directory from multer
  res.status((Number.isInteger(error.code) && error.code) || 500)
  res.render("500", {
    pageTitle: "Error!",
    message: error.message || "Oooops! something is wrong here!!",
  })
})

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000)
  })
  .catch((err) => console.log("=>>>>>>>>>", err))
