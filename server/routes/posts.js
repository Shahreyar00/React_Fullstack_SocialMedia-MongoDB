import express from "express";
import { getFeedPosts, deletePost, getUserPosts, likeDislikePost } from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

router.patch("/:id/like", verifyToken, likeDislikePost);

router.delete("/:id", verifyToken, deletePost);

export default router;
