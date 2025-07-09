const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export default SERVER_URL;

export const CREDIT_PACKS = [
  10,
  50,
  100,
  500,
];


export const PLAN_IDS = {

  UNLIMITED_YEARLY:{
    id: import.meta.env.VITE_RAZORPAY_YEARLY_PLAN_ID,
    name: "Unlimited Yearly",
   
    description: "Get unlimited affiliate links and campaigns for a year , 2  months free",
    totalBillingCycles: 5,
    

  },
  UNLIMITED_MONTHLY: {
    id: import.meta.env.VITE_RAZORPAY_MONTHLY_PLAN_ID,
    name: "Unlimited Monthly",
    description: "Get unlimited affiliate links and campaigns for a month",
    totalBillingCycles: 12,
  },

};


export const pricingList = [
  {
    price: "Credit Packs",
    list: [
      { detail: "10 CREDITS FOR ₹10" },
      { detail: "20 CREDITS FOR ₹20" },
      { detail: "50 CREDITS FOR ₹50" },
      { detail: "100 CREDITS FOR ₹100" },
    ],
  },
  {
    price: "Unlimited Monthly",
    list: [
      { detail: "UNLIMITED LINKS" },
      { detail: "AUTO RENEWED" },
      { detail: "CHARGED MONTHLY" },
      { detail: "CANCEL ANYTIME" },
    ],
  },
  {
    price: "Unlimited Yearly",
    list: [
      { detail: "UNLIMITED LINKS" },
      { detail: "AUTO RENEWED" },
      { detail: "CHARGED YEARLY" },
      { detail: "CANCEL ANYTIME" },
    ],
  },
];



