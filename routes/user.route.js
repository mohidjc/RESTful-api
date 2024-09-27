const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js')
const {getUsers, getUser, updateUser, deleteUser, createUser, followUser, unfollowUser, acceptFollow, rejectFollow} = require ('../controllers/user.controller.js')

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post("/", createUser);
router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unfollowUser);
router.put("/acceptFollow/:id", acceptFollow);
router.put("/rejectFollow/:id", rejectFollow);

module.exports = router;