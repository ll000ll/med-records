const express = require("express")
const path = require("path")

const bodyParser = require("body-parser")
const resultRoutes = require("./routes/results-routes")
const adminRoutes = require("./routes/admin-routes")

const HttpError = require("./models/http-error")

const app = express()
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, '..', 'views')))

app.use("/admin", adminRoutes)
app.use(resultRoutes)

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404)
  next(error)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "An unknown error occurred!" })
})

app.listen(5000)
