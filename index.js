const express = require('express')
const mongoose = require('mongoose');
const User = require('./models/user.model.js');
const app = express()
app.use(express.json());

app.listen(3000, () => {
    console.log('server is running on port 3000');
});

app.get('/', (req, res)=>{
    res.send("hello from Node api server");
});

app.post('/api/users', (req, res) =>{
    try{

    }catch(error){
        res.status(500).json({message: error.message});
    }

});


mongoose.connect("mongodb+srv://mohidjavedch:FLqtloOx6VpPxSlR@backenddb.earnplx.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("connected to database!")
})
.catch(()=>{
    console.log("connection failed")
})