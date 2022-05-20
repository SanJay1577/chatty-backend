import { User } from "../models/user.js";

const getAllUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  return res.status(200).json(user);
};

export { getAllUser };
