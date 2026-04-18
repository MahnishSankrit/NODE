
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createComment, getCommentByPost,updateComment, deleteComment, likeComment, replyComment } from "../controllers/comment.controller.js";
import { getRepliesByComment, getCommentsByUser } from "../controllers/comment.controller.js";

const router = Router();


// Create a comment on a post (authenticated)
router.post("/createcomment", auth, createComment);

// Get all comments for a post
router.get("/post/:postId", getCommentByPost);

// Like or unlike a comment (authenticated)
router.put("/like/:commentId", auth, likeComment);

// Reply to a comment (authenticated)
router.post("/reply/:postId", auth, replyComment);

// Get replies for a comment and comments by a user
router.get("/comments/replies/:commentId", getRepliesByComment);
router.get("/comments/user/:userId", getCommentsByUser);

// Update a comment (authenticated, only author)
router.put("/:commentId", auth, updateComment);

// Delete a comment (authenticated, only author)
router.delete("/:commentId", auth, deleteComment);

export default router;