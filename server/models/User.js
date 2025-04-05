const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
  
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'user',
    },
    sickLeaveBalance: {
      type: Number,
      default: 10,
    },
    
    paidLeaveBalance: {
      type: Number,
      default: 20,
    },
    exceptionBalance: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
