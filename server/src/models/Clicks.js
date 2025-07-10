const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    linkId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true,
    },
    ip:String,
    city: String,
    country: String,
    region: String,
    lattitude: Number,
    longitude: Number,
    isp: String,
    referrer: String,
    userAgent: String,
    deviceType: String,
    browser: String,
    clickedAt: {
        type: Date,
        default: Date.now,
    },
});

const Click = mongoose.model('Click', clickSchema);

module.exports = Click;