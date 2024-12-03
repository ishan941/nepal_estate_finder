import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandeler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created successfully");
  } catch (error) {
    next(error);
  }
};
export const singin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandeler(400, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandeler(400, "Wrong credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("User exists, generating token...");
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    console.log("User does not exist, creating new user...");
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    const newUser = new User({
      username:
        req.body.name.replace(/\s+/g, "").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    console.log("Saving new user...");
    await newUser.save();

    console.log("User saved, generating token...");
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (e) {
    console.error("Error in Google authentication:", e);
    next(e);
  }
};
