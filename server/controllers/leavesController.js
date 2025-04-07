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
  
  const getAllLeaves = async (req, res) => {
    try {
      const leaves = await Leave.find().sort({ createdAt: -1 });
  
      res.status(200).json({ leaves });
    } catch (error) {
      console.error("Get All Leaves Error:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  const updateLeaveStatus = async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { status, userId, type, daysCount } = req.body; 
  
      if (!status || !type || !daysCount || !userId) {
        return res.status(400).json({ msg: 'Missing required fields (status, type, daysCount, userId).' });
      }
  
      const leave = await Leave.findById(leaveId);
      if (!leave) {
        return res.status(404).json({ msg: 'Leave not found.' });
      }
  
      leave.status = status;
      await leave.save();
      
      if (status === 'approved') {
        let updateField = {};
      
        switch (type) {
          case 'sick':
            updateField.sickLeaveBalance = -daysCount;
            break;
          case 'paid':
            updateField.paidLeaveBalance = -daysCount;
            break;
          case 'exception':
            updateField.exceptionBalance = -daysCount;
            break;
          default:
            return res.status(400).json({ msg: 'Invalid leave type.' });
        }
      
        await User.findByIdAndUpdate(userId, {
          $inc: updateField,
        });
      }
  
      res.status(200).json({ msg: 'Leave status and user balance updated.', leave });
    } catch (error) {
      console.error("Update Leave Status Error:", error);
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  };
  
  

module.exports = {
  createLeave,
  getUserLeaves,
  getAllLeaves,
  updateLeaveStatus,
};
