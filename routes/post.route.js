const express = require("express");
const router = express.Router();

const {createPost, deletePost, updatePost} = require ('../controllers/post.controller.js')

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post("/", createPost);
router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unfollowUser);
router.put("/acceptFollow/:id", acceptFollow);
router.put("/rejectFollow/:id", rejectFollow);

module.exports = router;