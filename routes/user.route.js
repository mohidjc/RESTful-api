const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js')
const {getUser, updateUser, deleteUser, createUser, followUser, unfollowUser, acceptFollow, rejectFollow, LogInUser, searchUsers, getUserPosts} = require ('../controllers/user.controller.js')
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/user/:id',authMiddleware, getUser);
router.put('/update/:id',authMiddleware, updateUser);
router.delete('/delete/:id',authMiddleware, deleteUser);
router.post("/signUp", createUser);
router.post("/login", LogInUser);
router.put("/follow/:id",authMiddleware, followUser);
router.put("/unfollow/:id",authMiddleware, unfollowUser);
router.put("/acceptFollow/:id",authMiddleware, acceptFollow);
router.put("/rejectFollow/:id", authMiddleware,rejectFollow);
router.get('/search', authMiddleware, searchUsers);
router.get('/:id/posts',authMiddleware, getUserPosts);

module.exports = router;