
import { Router } from "express";
import { logout,login, register, getUserById } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",auth, logout);
router.get("/me",auth, getMe);
router.get("/:userId", auth, getUserById);

export default router