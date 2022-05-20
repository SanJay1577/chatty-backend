import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [{ type: ObjectId, ref: "user" }],
    latestMessage: {
      type: ObjectId,
      ref: "message",
    },
    groupAdmin: {
      type: ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("chat", chatSchema);

export { Chat };
