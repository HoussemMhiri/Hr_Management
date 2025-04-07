
const User = require("../models/User");
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("isAdmin Middleware Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = isAdmin;
