const Leave = require("../models/Leave");
const User = require("../models/User"); 

const createLeave = async (req, res) => {
    try {
      const { type, startDate, endDate, requestDate, reason, daysCount } = req.body;
      const userId = req.user._id;
  
     
      const newLeave = new Leave({
        userId: userId,
        type,
        startDate,
        endDate,
        requestDate,
        reason: reason?.trim(),
        daysCount,
      });
  
      
      await newLeave.save();
  
      let updateField;
  
      if (type === "sick") {
        updateField = { sickLeaveBalance: -daysCount }; 
      } else if (type === "paid") {
        updateField = { paidLeaveBalance: -daysCount };
      } else if (type === "exception") {
        updateField = { exceptionBalance: -daysCount }; 
      }
  
      if (updateField) {
     
        await User.findByIdAndUpdate(userId, {
          $inc: updateField, 
        });
      }
  
    
      res.status(201).json({ msg: "Leave created successfully", leave: newLeave });
    } catch (error) {
      console.error("Create Leave Error:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  const getUserLeaves = async (req, res) => {
    try {
      const userId = req.user._id;
      const leaves = await Leave.find({ userId }).sort({ createdAt: -1 });
  
      res.status(200).json({ leaves });
    } catch (error) {
      console.error("Get User Leaves Error:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  
module.exports = {
  createLeave,
  getUserLeaves,
};
