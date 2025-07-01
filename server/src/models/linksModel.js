const mongoose = require('mongoose');


const linkSchema = new mongoose.Schema({

    campaignTitle: {
        type: String,
        required: true,
    },

    originalUrl: {
        type: String,
        required: true,
    },
    
    category: {
        type: String,
        required: true,
    },

    thumbnail: {
        type: String,
        required: false,
    },

    clickCount: {
        type: Number,
        default: 0,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const Links = mongoose.model('Links', linkSchema);
module.exports = Links;