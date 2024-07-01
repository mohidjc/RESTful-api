const express = require('express')
const mongoose = require('mongoose');
const app = express()

app.listen(3000, () => {
    console.log('server is running on port 3000');
});

app.get('/', (req, res)=>{
    res.send("hello from Node api servr");
});

mongoose.connect("mongodb+srv://mohidjavedch:FLqtloOx6VpPxSlR@backenddb.earnplx.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("connected to database!")
})
.catch(()=>{
    console.log("connection failed")
})