import express from "express";
import { getAllUser } from "../controllers/user.js";
import { isSignedIn } from "../controllers/auth.js";
const router = express.Router(); 

router.get("/user", isSignedIn, getAllUser); 

export const userRouter = router; 