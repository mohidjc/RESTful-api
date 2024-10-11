const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {getRestaurant, createRestaurant, searchRestaurants, createReview, deleteReview, addRestaurantToFavorites, getUserFavorites, removeFromFavorites} = require ('../controllers/restaurant.controller.js')

router.get('/:restaurantId',authMiddleware, getRestaurant);
router.post("/create",authMiddleware, createRestaurant);
router.get("/search",authMiddleware, searchRestaurants);
router.post('/:restaurantId/review', authMiddleware, createReview);
router.delete('/:restaurantId/review/:reviewId', authMiddleware, deleteReview);
router.put('/favorites/:restaurantId', authMiddleware, addRestaurantToFavorites);
router.get('/favorites', authMiddleware, getUserFavorites);
router.delete('/favorites/:restaurantId', authMiddleware, removeFromFavorites);


module.exports = router;