const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  },
  type: {
    type: String,
    enum: ["paid", "sick", "exception"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    },
requestDate: {
        type: Date,
        required: true,
    },
  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    },
  daysCount: {
        type: Number,
        default: 0, 
      },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Leave", LeaveSchema);
