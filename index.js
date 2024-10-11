const express = require('express')
const mongoose = require('mongoose');
const usersRoute = require('./routes/user.route.js');
const postRoutes = require('./routes/post.route.js');
const restaurantRoutes = require('./routes/restaurant.route.js');
// const restaurantRoutes = require('./routes/restaurant.route.js');
const app = express()

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// routes
app.use("/api/users", usersRoute);
app.use('/api/posts', postRoutes);
app.use('/api/restaurant', restaurantRoutes);
// app.use('/api/restaurants', restaurantRoutes);


app.get('/', (req, res)=>{
    res.send("hello from Node api server");
});


mongoose.connect("mongodb+srv://mohidjavedch:FLqtloOx6VpPxSlR@backenddb.earnplx.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("connected to database!")
    app.listen(3000, () => {
        console.log('server is running on port 3000');
    });
})
.catch(()=>{
    console.log("connection failed")
})