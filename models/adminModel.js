const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "student must be given a name"],
    },
    password: {
      type: String,
      required: [true, "password is necessary"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "password confirm is necessary"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password not matching",
      },
    },
    role: {
      type: String,
      default: "admin",
    },
    email: {
      type: String,
      required: [true, "student must be given an email"],
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.checkPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
