const mongoose = require('mongoose');

const User_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [0, 1], // 0: member, 1: manager
        default: 0
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', User_Schema);