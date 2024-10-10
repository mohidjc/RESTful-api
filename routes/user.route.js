const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js')
const {getUsers, getUser, updateUser, deleteUser, createUser, followUser, unfollowUser, acceptFollow, rejectFollow, LogInUser} = require ('../controllers/user.controller.js')
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getUsers);
router.get('/:id',authMiddleware, getUser);
router.put('/:id',authMiddleware, updateUser);
router.delete('/:id',authMiddleware, deleteUser);
router.post("/", createUser);
router.post("/login", LogInUser);
router.put("/follow/:id",authMiddleware, followUser);
router.put("/unfollow/:id",authMiddleware, unfollowUser);
router.put("/acceptFollow/:id",authMiddleware, acceptFollow);
router.put("/rejectFollow/:id", authMiddleware,rejectFollow);

module.exports = router;