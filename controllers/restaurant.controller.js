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

module.exports = {
    getRestaurant,
}