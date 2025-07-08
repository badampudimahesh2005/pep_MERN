const CREDIT_PACKS = {
    10:10,
    50:50,
    100:100,
    500:500,
};


const PLANS_IDS = {
    UNLIMITED_YEARLY: {
        id: process.env.RAZORPAY_YEARLY_PLAN_ID,
        planName: "Unlimited Yearly Plan",
        // This is the number of billing cycles for the plan, means automatically renews after this many cycles.
        // For example, if the plan is billed annually, this would be 1.
        totalBillingCycleCount: 5,
    },

    UNLIMITED_MONTHLY: {
        id: process.env.RAZORPAY_MONTHLY_PLAN_ID,
        planName: "Unlimited Monthly Plan",
        totalBillingCycleCount: 12,
    }
}

module.exports = {
    CREDIT_PACKS,
    PLANS_IDS
};

