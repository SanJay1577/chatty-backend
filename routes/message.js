import express from "express"; 
import { isSignedIn } from "../controllers/auth.js";
import { allMessages, sendMessage } from "../controllers/message.js";


const router = express.Router(); 

router.post("/message", isSignedIn, sendMessage); 
router.get("/message/:chatId", isSignedIn, allMessages); 

export const messageRouter = router; 