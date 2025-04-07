const express = require("express");
const {  login, getAuthUser, getAllUsers } = require("../controllers/authController");
const authUser = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", login);
router.get("/", authUser, getAuthUser);
router.get("/all",  getAllUsers);

module.exports = router;
