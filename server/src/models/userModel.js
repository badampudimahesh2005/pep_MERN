const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
    },
    isGoogleUser: {
        type: Boolean,
        default: false,
    },

});

const User = mongoose.model('User', userSchema);
module.exports = User;