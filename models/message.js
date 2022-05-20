import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: ObjectId,
      ref: "chat",
    },
    readBy: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export { Message };
