import express from "express";
import { signup, login } from "../controllers/auth.js";

//initializing the router...
const router = express.Router();

//routes for authentication
router.post("/signup", signup);
router.post("/login", login);

export const authRouter = router;
