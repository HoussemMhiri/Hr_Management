const express = require("express");
const router = express.Router();
const validateLeave = require("../middlewares/validateLeave");
const { createLeave, getUserLeaves, getAllLeaves, updateLeaveStatus } = require("../controllers/leavesController");
const authUser = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

router.post("/", authUser, validateLeave, createLeave);
router.get("/", authUser, getUserLeaves); 
router.get("/all",  getAllLeaves); 
router.put("/:leaveId",  isAdmin, updateLeaveStatus); 
 

module.exports = router;
