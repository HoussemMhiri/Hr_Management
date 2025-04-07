const express = require("express");
const {  login, getAuthUser } = require("../controllers/authController");
const authUser = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", login);
router.get("/", authUser, getAuthUser);

module.exports = router;
