import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
export const test = (req, res) => {
  res.json({
    message: "hallo world",
  });
};


export const updateUser = async (req, res) => {
  try {
    // Check if the authenticated user is authorized to update this user
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        message: "You can only update your own account",
      });
    }

    // Hash the password if it's provided in the request body
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avathar: req.body?.image?.avathar, // Check if the image is provided in the request body
        },
      },
      { new: true }
    );

    // Return a success message along with the updated user data
    // const { _id, username, email } = updatedUser;
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
};