const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID provided" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = authMiddleware;
