const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userModel");
const { CREDIT_PACKS, PLANS_IDS } = require("../constants/payments");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  createOrder: async (req, res) => {
    try {
      const { credits } = req.body;

      if (!CREDIT_PACKS[credits]) {
        return res
          .status(400)
          .json({ message: "Invalid credit pack selected" });
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
        order: order,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
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
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.credits += Number(credits);
      const savedUser = await user.save();

      res.status(200).json({
        message: "Order verified successfully",
        user: savedUser,
      });
    } catch (error) {
      console.error("Error verifying order:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  createSubscription: async (req, res) => {
    try {
      const { plan_name } = req.body;
      if (!PLANS_IDS[plan_name]) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      const planDetails = PLANS_IDS[plan_name];

      const subscription = await razorpayInstance.subscriptions.create({
        plan_id: planDetails.id,
        customer_notify: 1, // Notify customer via email
        total_count: planDetails.totalBillingCycleCount, // Total billing cycles

        //customer notes field, razorpay sends it as is in the events.
        //we can use this field to store user details, so that we can use it later to identify the user.

        notes: {
          email: req.user.email,
          username: req.user.username,
          userId: req.user.id,
        },
      });

      res.status(200).json({
        message: "Subscription created successfully",
        subscription: subscription,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  verifySubscription: async (req, res) => {
    try {
      const { subscription_id } = req.body;

      const subscription = await razorpayInstance.subscriptions.fetch(
        subscription_id
      );
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      const user = await User.findById({ _id: req.user.id });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found for this subscription" });
      }

      // Update user subscription details
      user.subscription = {
        id: subscription.id,
        plan_id: subscription.plan_id,
        status: subscription.status,
        start: subscription.current_start
          ? new Date(subscription.current_start * 1000)
          : null,
        end: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : null,
      };

      await user.save();

      res.status(200).json({
        message: "Subscription verified successfully",
        user: user,
      });
    } catch (error) {
      console.error("Error verifying subscription:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  handleWebhookEvent: async (request, response) => {
    try {
      console.log("Received event...");
      const signature = request.header["x-razorpay-signature"];
      const body = request.body;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        return response.status(400).send("Invalid signature");
      }

      const payload = JSON.parse(body);
      console.log(JSON.stringify(payload, null, 2));
      const event = payload.event;
      const subscriptionData = payload.payload.subscription.entity;

      const razorpaySubscriptionId = subscriptionData.id;
      let userId = subscriptionData.notes?.userId;
      if (!userId) {
        console.log("UserId not found via notes");
        return response.status(400).send("UserId not found via notes");
      }

      let newStatus = "";
      switch (event) {
        case "subscription.activated":
          newStatus = "active";
          break;
        case "subscription.pending":
          newStatus = "pending";
          break;
        case "subscription.cancelled":
          newStatus = "cancelled";
          break;
        case "subscription.completed":
          newStatus = "completed";
          break;
        default:
          console.log("Unhandled event: ", event);
          return response.status(200).send("Unhandled event");
      }

      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            "subscription.id": razorpaySubscriptionId,
            "subscription.status": newStatus,
            "subscription.start": subscriptionData.start_at
              ? new Date(subscriptionData.start_at * 1000)
              : null,
            "subscription.end": subscriptionData.end_at
              ? new Date(subscriptionData.end_at * 1000)
              : null,
            "subscription.lastBillDate": subscriptionData.current_start
              ? new Date(subscriptionData.current_start * 1000)
              : null,
            "subscription.nextBillDate": subscriptionData.current_end
              ? new Date(subscriptionData.current_end * 1000)
              : null,
            "subscription.paymentsMade": subscriptionData.paid_count,
            "subscription.paymentsRemaining": subscriptionData.remaining_count,
          },
        },
        { new: true }
      );

      if (!user) {
        return response.status(400).send("UserId does not exist");
      }

      console.log(
        `Updated subscription for user ${user.username} to ${newStatus}`
      );
      return response.status(200).send("Event processed");
    } catch (error) {
      console.log(error);
      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  cancelSubscription: async (request, response) => {
    try {
      const { subscription_id } = request.body;

      if (!subscription_id) {
        return response.status(400).json({
          message: "SubscriptionID is required to cancel",
        });
      }

      const data = await razorpayInstance.subscriptions.cancel(subscription_id);

      response.json(data);
    } catch (error) {
      console.log(error);
      response.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = paymentController;
