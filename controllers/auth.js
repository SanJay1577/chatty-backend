import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import joi from "joi";
import { generateAuthToken } from "../models/user.js";

const signup = async (req, res) => {
  try {
    //validating the input fields
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //finding the user
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({ error: "Given email is already registered" });
    //hasing th password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //saving new user
    user = await new User({ ...req.body, password: hashedPassword }).save();
    const token = generateAuthToken(user._id);
    const { _id, name, email, pic } = await user;
    //returning successmessage
    return res.status(200).json({ user: { _id, name, email, pic }, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//login validation method;
const validateLogin = (data) => {
  const Schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return Schema.validate(data);
};

const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //checking wheather the user exist in our database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Invalid Authentication" });
    //comparing the hashed password..
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Invalid Authentication" });
    //generating token
    const token = generateAuthToken(user._id);
    const { _id, name, email, pic } = await user;
    return res.status(200).json({ user: { _id, name, email, pic }, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const isSignedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      req.status(401).json({ error: "Probelm in Authorization" });
    }
  }

  if (!token) return res.status(400).json({ error: "Access denied" });
};

export { signup, login, isSignedIn };
