import bcrypt from "bcrypt";
import User from "../models/usermodel.js";

export const signup = async (req, res) => {
    try {
     
      
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      req.body.password = hashedpassword;
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).send({
        message: "registered successfull",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `signup controller ${error.message}`,
      });
    }
  };
  