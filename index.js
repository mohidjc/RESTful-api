require('dotenv').config(); // need to npm install dotenv
const express = require('express')
const mongoose = require('mongoose');
const usersRoute = require('./routes/user.route.js');
const postRoutes = require('./routes/post.route.js');
const restaurantRoutes = require('./routes/restaurant.route.js');
const bodyParserMiddleware = require('./middlewares/bodyParserMiddleware.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express()
bodyParserMiddleware(app);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;


// routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", usersRoute);
app.use('/api/posts', postRoutes);
app.use('/api/restaurants', restaurantRoutes);



app.get('/', (req, res)=>{
    res.send("hello from Node api server");
});


mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log("connected to database!")
    app.listen(PORT, () => {
        console.log('server is running on port 3000');
    });
})
.catch(()=>{
    console.log("connection failed")
})