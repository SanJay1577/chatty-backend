import mongoose from "mongoose";
import joi from "joi";
import passwordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

const User = mongoose.model("user", userSchema);

//validation
const validate = (data) => {
  const schema = joi.object({
    name: joi.string().required().label("Name"),
    email: joi.string().email().required().label("Email"),
    password: passwordComplexity().required(),
    pic:joi.string().label("Pic")
  });
  return schema.validate(data);
};

//jwt token generation

const generateAuthToken = (id)=>{
  return jwt.sign({id}, process.env.SECRET_KEY, {expiresIn:"30d"}); 
}

export { User, validate, generateAuthToken };
