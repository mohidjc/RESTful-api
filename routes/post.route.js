const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {createPost, deletePost, updatePost, getUserPosts, likePost, unlikePost, addComment, deleteComment} = require ('../controllers/post.controller.js')

router.get('/:id',authMiddleware, getUserPosts);
router.put('/:id',authMiddleware, updatePost);
router.delete('/:id',authMiddleware, deletePost);
router.post("/create",authMiddleware, createPost);
router.put('/:id/like',authMiddleware, likePost);
router.put('/:id/unlike',authMiddleware, unlikePost);
router.post('/:id/comments',authMiddleware, addComment);
router.delete('/:postId/comments/:commentId',authMiddleware, deleteComment);


module.exports = router;