
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createPost, getallposts, getPostById, updatePost, deletePost, likePost, getPostByUser, searchPosts } from "../controllers/post.controller.js";

const router = Router();



// Create a post (authenticated)
router.post("/createPost", auth, createPost);

// Get all posts (public)
router.get("/getallpost", getallposts);

// Like/unlike post (authenticated)
router.put("/like/:postId", auth, likePost);

router.get("/search", searchPosts); // Search posts by title or tags    
// Get single post by ID
router.get("/:postId", getPostById);

// Update post (authenticated)
router.put("/:postId", auth, updatePost);

// Delete post (authenticated)
router.delete("/:postId", auth, deletePost);

router.get("/user/:userId", getPostByUser); // Get posts by user ID

export default router;