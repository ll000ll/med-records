const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true, unique: true },
  password: { type: String, required: true, minlength: 2 },
  email: { type: String },
  accessLevel: {
    type: String,
    enum: ["regular", "auditor", "admin"],
    default: "regular",
  },
  docs: [{ type: String }],
})

module.exports = mongoose.model("User", userSchema)
