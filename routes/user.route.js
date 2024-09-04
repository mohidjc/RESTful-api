const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js')
const {getUsers, getUser, updateUser, deleteUser, createUser} = require ('../controllers/user.controller.js')

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post("/", createUser);

module.exports = router;