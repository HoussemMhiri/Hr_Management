const express = require("express");
const router = express.Router();
const validateLeave = require("../middlewares/validateLeave");
const { createLeave, getUserLeaves, getAllLeaves } = require("../controllers/leavesController");
const authUser = require("../middlewares/authMiddleware");

router.post("/", authUser, validateLeave, createLeave);
router.get("/", authUser, getUserLeaves); 
 

module.exports = router;
