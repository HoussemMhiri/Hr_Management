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
  
  
module.exports = {

    login,
  };
  