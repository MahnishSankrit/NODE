import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getmyTodos,
  getmytodo,
  UpdateTask,
  deleteTask
} from "../controllers/todo.controller.js";

const router = Router();

// User-specific routes only
router.route("/mytodos").post(auth, createTask);           // Create todo
router.route("/mytodos").get(auth, getmyTodos);            // Get all todos for user
router.route("/mytodos/:id").get(auth, getmytodo);         // Get single todo for user
router.route("/mytodos/:id").put(auth, UpdateTask);        // Update user's todo
router.route("/mytodos/:id").delete(auth, deleteTask);     // Delete user's todo

export default router;