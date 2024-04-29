import bcrypt from "bcrypt";
import User from "../models/usermodel.js";
import { errorHandler } from "../middleware/error.js";
import jwt from "jsonwebtoken";
// not working these route
//always given axios error saying that failed to sign up
export const signup = async (req, res) => {
  try {
    console.log( "signup "+req.body);
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
    res.status(500).send({
      message: "failed to sign up",
    });
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return res.status(401).send({
        message: "invalid User",
      });
    }
    const validpassword = bcrypt.compareSync(password, validUser.password);
    if (!validpassword) {
      return res.status(401).send({
        message: "invalid credentials",
      });
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error.message);
  }
};
export const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatePassword, salt);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photoURL
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};