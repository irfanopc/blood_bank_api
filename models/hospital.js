const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hospitalSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter a email"],
    unique: [true, "Email already exits"],
  },
  hospital_name:{
    type : String
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
  },
  blood_samples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blood_samples",
    },
  ],
  blood_request:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blood_request",  
    }
  ]
});

hospitalSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

hospitalSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

hospitalSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const Hospital = mongoose.model("hospital", hospitalSchema);

module.exports = Hospital;
