const User = require("../models/user.model.js")
const Post = require("../models/post.model.js")
const Restaurant = require("../models/Restaurant.model.js")

const getRestaurant = async (req, res)=>{
    try{
        const restaurantId = req.params.id; 
        try {
          const restaurant = await Restaurant.findById(restaurantId);
          if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
          }
          res.status(200).json(restaurant);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching restaurant', error });
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


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

  

module.exports = {
    getRestaurant,
    createRestaurant,
    searchRestaurants
}