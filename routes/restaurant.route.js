const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {getRestaurant} = require ('../controllers/restaurant.controller.js')

router.get('/:id',authMiddleware, getRestaurant);

module.exports = router;