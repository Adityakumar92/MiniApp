const express = require('express');
const app=express();
const cors = require('cors');
const dotenv=require('dotenv');
dotenv.config();

require('./connection/Database/mongodb');

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/route'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})