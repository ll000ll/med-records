const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true, unique: true },
  password: { type: String, required: true, minlength: 2 },
  email: { type: String },
  accessLevel: {
    type: String,
    default: "regular",
  },
  docs: [{ type: String }],
})

const superUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 2 },
  accessLevel: {
    type: String,
    enum: ["auditor", "admin", "adminForApproval"],
    default: "admin",
  },
  resetToken: String ,
  resetTokenExpiration: Date,
})

module.exports = {
  User: mongoose.model("User", userSchema),
  SuperUser: mongoose.model("Superuser", superUserSchema),
}
