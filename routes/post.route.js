const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {createPost, deletePost, updatePost, getUserPosts} = require ('../controllers/post.controller.js')

router.get('/:id',authMiddleware, getUserPosts);
router.put('/:id',authMiddleware, updatePost);
router.delete('/:id',authMiddleware, deletePost);
router.post("/",authMiddleware, createPost);


module.exports = router;