import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";

const accesChat = async (req, res) => {
  const userId = await req.body.userId;
  if (!userId)
    return res.status(400).json({ error: "no user chat is requested" });

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res.status(200).send(isChat[0]);
  } else {
    var newChat = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await new Chat(newChat).save();
      const AllChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).json(AllChat);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.messsage });
    }
  }
};

const FetchChatsOfUser = async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq:req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAr: -1 })
      .then(async (data) => {
        data = await User.populate(data, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.status(200).json(data);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createNewGroup = async (req, res) => {
  const { name, users } = await req.body;
  if (!name || !users)
    return res.status(400).json({ error: "Please fill all the details" });

  var groupUsers = await users;
  if (groupUsers.length < 2) {
    return res
      .status(400)
      .json({ error: "Group should have more then two users" });
  }

  groupUsers.push(req.user._id);

  try {
    const groupChat = await new Chat({
      chatName: name,
      users,
      groupUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    }).save();

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = await req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat)
    return res.status(404).json({ error: "Chat doesn't exist" });

  return res.status(200).json(updatedChat);
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = await req.body;

  const addedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $addToSet: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser)
    return res.status(404).json({ error: "cannot added to the group" });
  return res.status(200).json(addedUser);
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = await req.body;

  const removeUser = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUser)
    return res.status(404).json({ error: "cannot added to the group" });
    return res.status(200).json(removeUser);
};

export {
  accesChat,
  FetchChatsOfUser,
  createNewGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
