import express from "express";
import { isSignedIn } from "../controllers/auth.js";
import {
  accesChat,
  addToGroup,
  createNewGroup,
  FetchChatsOfUser,
  removeFromGroup,
  renameGroup,
} from "../controllers/chat.js";
const router = express.Router();

router.post("/chat", isSignedIn, accesChat);
router.get("/chat", isSignedIn, FetchChatsOfUser);
router.post("/chat/creategroup", isSignedIn, createNewGroup);
router.put("/chat/renamegroup", isSignedIn, renameGroup);
router.put("/chat/addtogroup", isSignedIn, addToGroup);
router.put("/chat/removeuser", isSignedIn, removeFromGroup);

export const chatRouter = router;
