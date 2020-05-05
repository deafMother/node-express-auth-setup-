const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "student must be given a name"],
    },
    rollNo: {
      type: String,
      required: [true, "student must be given a rollno"],
    },
    department: {
      type: String,
      required: [true, "student must be given a department"],
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
      default: "student",
    },
    email: {
      type: String,
      required: [true, "student must be given an email"],
    },
    passOut: {
      type: Boolean,
      default: false,
    },
    semester: {
      type: String,
      enum: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
      required: [true, "student must be given an semester"],
    },
    testsTaken: [
      {
        // this is the id of the submitted test .i.e. the resuts
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

studentSchema.methods.checkPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

studentSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
