const User = require("../models/user.model.js")
const Post = require("../models/post.model.js")
const Restaurant = require("../models/Restaurant.model.js")

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management and operations
 */


/**
 * @swagger
 * /restaurants/{restaurantId}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 website:
 *                   type: string
 *                 hours:
 *                   type: string
 *                 type:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Error fetching restaurant
 */

const getRestaurant = async (req, res)=>{
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId);
    
        if (!restaurant) {
          return res.status(404).json({ message: 'Restaurant not found' });
        }
    
        // If the restaurant has no reviews, set the rating to 0
        if (restaurant.reviews.length === 0) {
          restaurant.averageRating = 0;
        } else {
          // Calculate the average rating for the restaurant
          const totalRatings = restaurant.reviews.reduce((acc, review) => acc + review.rating, 0);
          restaurant.averageRating = (totalRatings / restaurant.reviews.length).toFixed(2); // Store the average rating
        }
    
        res.status(200).json({
          id: restaurant._id,
          name: restaurant.name,
          location: restaurant.location,
          phoneNumber: restaurant.phoneNumber,
          email: restaurant.email,
          website: restaurant.website,
          hours: restaurant.hours,
          type: restaurant.type,
          rating: restaurant.averageRating,  // Add the average rating to the response
          reviews: restaurant.reviews
        });
    
      } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant', error });
      }
}

/**
 * @swagger
 * /restaurants/create:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               hours:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       500:
 *         description: Server error
 */
const createRestaurant = async (req, res) => {
    try {
      const { name, location, phoneNumber, email, website, hours, type, rating, reviews } = req.body;
      const newRestaurant = new Restaurant({
        name,
        location,
        phoneNumber,
        email,
        website,
        hours,
        type,
        rating,
        reviews
      });
      const savedRestaurant = await newRestaurant.save();
      res.status(201).json(savedRestaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

/**
 * @swagger
 * /restaurants/search:
 *   get:
 *     summary: Search restaurants by type
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         description: Type of restaurant to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching restaurants
 *       404:
 *         description: No restaurants found
 *       500:
 *         description: Server error
 */
const searchRestaurants = async (req, res) => {
    try {
      const { type } = req.query;
      const restaurants = await Restaurant.find({ type: new RegExp(type, 'i') });
  
      if (restaurants.length === 0) {
        return res.status(404).json({ message: "No restaurants found for the specified type" });
      }
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /restaurants/{restaurantId}/reviews:
 *   post:
 *     summary: Create a review for a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       404:
 *         description: Restaurant not found
 *       400:
 *         description: User has already reviewed this restaurant
 *       500:
 *         description: Server error
 */
const createReview = async (req, res) => {
  try {
    const { restaurantId } = req.params; 
    const { rating, comment } = req.body; 
    const userId = req.user.id; 

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the user already has a review for this restaurant
    const existingReview = restaurant.reviews.find(review => review.user.toString() === userId);

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this restaurant' });
    }

    const newReview = {
      user: userId,
      rating,
      comment,
      createdAt: new Date()
    };

    restaurant.reviews.push(newReview);
    await restaurant.save();

    res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 

/**
 * @swagger
 * /restaurants/{restaurantId}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review for a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Restaurant or review not found
 *       500:
 *         description: Server error
 */

const deleteReview = async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params; 
    const userId = req.user.id;
    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find the review
    const reviewIndex = restaurant.reviews.findIndex(review => review._id.toString() === reviewId && review.user.toString() === userId);

    // If review does not exist or doesn't belong to the user
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found or you are not authorized to delete this review' });
    }

    // Remove the review
    restaurant.reviews.splice(reviewIndex, 1); // Remove the review at the found index

    // Save the updated restaurant
    await restaurant.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /restaurants/favorites/{restaurantId}:
 *   post:
 *     summary: Add a restaurant to user favorites
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant added to favorites
 *       404:
 *         description: Restaurant or user not found
 *       400:
 *         description: Restaurant is already in favorites
 *       500:
 *         description: Server error
 */
const addRestaurantToFavorites = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { restaurantId } = req.params; 

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Find the current user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the restaurant is already in the user's favorites
        if (user.favorites.includes(restaurantId)) {
            return res.status(400).json({ message: 'Restaurant is already in your favorites' });
        }

        // Add the restaurant to the user's favorites
        user.favorites.push(restaurantId);
        await user.save();

        res.status(200).json({ message: 'Restaurant added to favorites', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /restaurants/favorites/{restaurantId}:
 *   delete:
 *     summary: Remove a restaurant from user favorites
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant removed from favorites
 *       404:
 *         description: Restaurant or user not found
 *       500:
 *         description: Server error
 */
const removeFromFavorites = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { restaurantId } = req.params;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the restaurant is in the user's favorites
        if (!currentUser.favorites.includes(restaurantId)) {
            return res.status(400).json({ message: 'Restaurant is not in your favorites' });
        }
        // Remove the restaurant from the user's favorites
        currentUser.favorites = currentUser.favorites.filter(fav => fav.toString() !== restaurantId);
        await currentUser.save();

        res.status(200).json({
            message: `Restaurant removed from your favorites`,
            updatedFavorites: currentUser.favorites
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /restaurants/favorites:
 *   get:
 *     summary: Get user's favorite restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of favorite restaurants
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the current user and populate the favorite restaurants
        const user = await User.findById(userId).populate('favorites');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getRestaurant,
    createRestaurant,
    searchRestaurants,
    createReview,
    deleteReview,
    addRestaurantToFavorites,
    removeFromFavorites,
    getUserFavorites
}