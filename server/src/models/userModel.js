const mongoose = require('mongoose');


const subscriptionSchema = new mongoose.Schema({

    id: {type: String},//razorpay subscription id
    status: {type: String, default: 'pending'},
    start: {type: Date },
    end: {type: Date },
    lastBillDate: {type: Date },
    nextBillDate: {type: Date },
    paymentsMade: {type: Number },
    paymentsRemaining: {type: Number },
});
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
    role: {
        type: String,
       default: 'admin',
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    credits : {
        type: Number,
        default: 0,
    },
    resetPasswordCode: {
        type: String,
        required: false,
    },
    resetPasswordExpiry: {
        type: Date,
        required: false,
    },
    subscription: {
        type: subscriptionSchema,
        default: null,
    },


});

const User = mongoose.model('User', userSchema);
module.exports = User;