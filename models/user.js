const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true },
  password: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true },
  docs: [{ type: String }],
})

module.exports = mongoose.model("User", userSchema)
