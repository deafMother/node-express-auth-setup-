const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const teacherSehema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "teacher must be given a name"],
    },
    email: {
      type: String,
      required: [true, "teacher must be given an email"],
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
        message: "Passwords not matching",
      },
    },
    role: {
      type: String,
      default: "teacher",
    },
    department: {
      type: String,
      required: [true, "teacher must be given an department"],
    },
    testsTaken: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    testsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

teacherSehema.methods.checkPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

teacherSehema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const Teacher = mongoose.model("Teacher", teacherSehema);

module.exports = Teacher;
