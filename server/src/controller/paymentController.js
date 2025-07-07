const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/userModel');
const { CREDIT_PACKS } = require('../constants/payments'); 

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const paymentController ={

    createOrder: async (req, res) => {
        try {

            const {credits} = req.body;

            if(!CREDIT_PACKS[credits]) {
                return res.status(400).json({ message: "Invalid credit pack selected" });
            }

            const amount = CREDIT_PACKS[credits] * 100; // Convert to paise

            const order = await razorpayInstance.orders.create({
                amount: amount,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1, // Auto capture
            });

            if (!order || !order.id) {
                return res.status(500).json({ message: "Failed to create order" });
            }

            res.status(200).json({
                message: "Order created successfully",
                order : order
            });

        }catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    verifyOrder: async (req, res) => {
        try {
            const { 
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                credits,
            } = req.body;

            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ message: "Invalid signature" });
            }

           const user = await User.findById(req.user.id); 
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

          user.credits += Number(credits);
            const savedUser =await user.save();

            res.status(200).json({
                message: "Order verified successfully",
                user:savedUser,
            });
            

        } catch (error) {
            console.error("Error verifying order:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },
}

module.exports = paymentController;