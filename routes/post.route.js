const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {createPost, deletePost, updatePost, likePost, unlikePost, addComment, deleteComment} = require ('../controllers/post.controller.js')


router.put('/update/:id',authMiddleware, updatePost);
router.delete('/delete/:id',authMiddleware, deletePost);
router.post("/create",authMiddleware, createPost);
router.put('/:id/like',authMiddleware, likePost);
router.put('/:id/unlike',authMiddleware, unlikePost);
router.post('/:id/comment',authMiddleware, addComment);
router.delete('/:postId/comment/:commentId',authMiddleware, deleteComment);


module.exports = router;