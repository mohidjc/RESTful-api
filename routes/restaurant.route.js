const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {getRestaurant, createRestaurant, searchRestaurants, } = require ('../controllers/restaurant.controller.js')

router.get('/:id',authMiddleware, getRestaurant);
router.post("/",authMiddleware, createRestaurant);
router.get("/search",authMiddleware, searchRestaurants);


module.exports = router;