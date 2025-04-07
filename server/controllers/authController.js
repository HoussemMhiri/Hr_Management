const User = require("../models/User");

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
   
        const isUserExist = await User.findOne({ email: email.toLowerCase() });
  
  
      if (!isUserExist) {
        return res.status(403).json({ msg: "Wrong email" });
      }
  
     
      if (password !== isUserExist.password) {
        return res.status(403).json({ msg: "Wrong password" });
      }
  
      
      res.status(200).json({
        user: {
         ...isUserExist._doc,
        },
        msg: "Login successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  
  const getAuthUser = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password"); // exclude password
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Get Auth User Error:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
};
module.exports = {
  login,
  getAuthUser
  };
  