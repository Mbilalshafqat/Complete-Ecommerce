const mongoose = require("mongoose");
const Validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your UserName"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [Validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: 6,
  },
  role: {
    type: String,
    default: "user",
  },
  // phoneNumber: {
  //   type: Number,
  //   required: [true, "Please Enter Your Mobile Number"],
  // },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  OTP: {
    type: Number,
  },
  Expire_otp: {
    type: Date,
  },
  verify: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
});

UserSchema.index({ Expire_otp: 1 }, { expireAfterSeconds: 0 });

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
