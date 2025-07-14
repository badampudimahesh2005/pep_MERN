import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import SERVER_URL, { CREDIT_PACKS, PLAN_IDS, pricingList } from "../../utils";
import { setUser } from "../../store/slices/userSlice";

function PurchaseCredit() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleBuyCredits = async (credits) => {
    setShowModal(false);
    try {
      const { data } = await axios.post(`${SERVER_URL}/payments/create-order`, {
        credits
      }, { withCredentials: true });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Affiliate++',
        description: `${credits} Credits Pack`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post(`${SERVER_URL}/payments/verify-order`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits
            }, { withCredentials: true });

            console.log('Payment verified successfully:', data.user);

            dispatch(setUser(data.user));

            setMessage(`${credits} credits added!`);
          } catch (error) {
            console.error(error);
            setErrors({ message: 'Unable to purchase credits, please try again' });
          }
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setErrors({ message: 'Unable to purchase credits, please try again' });
    }
  };

  const handleSubscribe = async (planKey) => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/payments/create-subscription`, {
        plan_name: planKey
      }, { withCredentials: true });

      const plan = PLAN_IDS[planKey];
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: plan.planName,
        description: plan.description,
        subscription_id: data.subscription.id,
        handler: async function (response) {
          try {
            const user = await axios.post(`${SERVER_URL}/payments/verify-subscription`, {
              subscription_id: response.razorpay_subscription_id
            }, { withCredentials: true });

            dispatch(setUser(user.data));   
            setMessage('Subscription activated');
          } catch (error) {
            setErrors({ message: 'Unable to activate subscription, please try again' });
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setErrors({ message: 'Failed to create subscription' });
    }
  };

  return (
    
      <section className=" flex-1 flex flex-col  p-10">
        <div className="flex-grow flex items-center ">
          <div className="max-w-6xl mx-auto px-4">
          {errors.message && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{errors.message}</div>}
            {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>}

    <div className="flex flex-col md:flex-row justify-between items-start mb-10 text-black">
      <div>
        <h3 className="text-3xl font-bold">Choose Plan</h3>
        <p className="text-gray-900 mt-2">Flexible options: one-time credits or recurring subscriptions.</p>
      </div>

      <div className="text-right mt-6 md:mt-0">
        <h3 className="text-2xl font-semibold">Current Balance</h3>
        <p className="text-gray-900 mt-2">{userDetails.credits} Credits</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Credit Pack Card */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 shadow-md">
        <h2 className="text-3xl font-bold mb-2">CREDITS</h2>
        <p className="mb-4 text-sm opacity-90">One-time use. Perfect for quick boosts.</p>
        <ul className="text-white space-y-1 mb-6">
          {CREDIT_PACKS.map((c) => (
            <li key={c} className="flex items-center">
              ✅ {c} Credits for ₹{c}
            </li>
          ))}
        </ul>
        <button
          className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 w-full cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          BUY CREDITS
        </button>
      </div>

      {/* Monthly Subscription Plan */}
      <div className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white p-8 shadow-md">
        <h2 className="text-3xl font-bold mb-2">₹500/mo</h2>
        <p className="text-lg font-semibold mb-4">STANDARD</p>
        <ul className="space-y-1 mb-6">
          {pricingList[1].list.map((item, i) => (
            <li key={i} className="flex items-center">
              ✅ {item.detail}
            </li>
          ))}
        </ul>
        <button
          className="bg-white text-purple-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 w-full cursor-pointer"
          onClick={() => handleSubscribe('UNLIMITED_MONTHLY')}
        >
          SUBSCRIBE MONTHLY
        </button>
      </div>

      {/* Yearly Subscription Plan */}
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white p-8 shadow-md">
        <h2 className="text-3xl font-bold mb-2">₹1000/yr</h2>
        <p className="text-lg font-semibold mb-4">PREMIUM</p>
        <ul className="space-y-1 mb-6">
          {pricingList[2].list.map((item, i) => (
            <li key={i} className="flex items-center">
              ✅ {item.detail}
            </li>
          ))}
        </ul>
        <button
          className="bg-white text-pink-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 w-full cursor-pointer"
          onClick={() => handleSubscribe('UNLIMITED_YEARLY')}
        >
          SUBSCRIBE YEARLY
        </button>
      </div>
    </div>

    {/* Modal Replacement */}
   {showModal && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
      
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold cursor-pointer"
      >
        &times;
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Buy Credits
      </h2>

      {/* Credit Options */}
      <div className="flex flex-wrap justify-center gap-3">
        {CREDIT_PACKS.map((c) => (
          <button
            key={c}
            onClick={() => handleBuyCredits(c)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200 shadow-md cursor-pointer"
          >
            Buy {c} Credits
          </button>
        ))}
      </div>
    </div>
  </div>
)}

        </div>
        </div>
</section>

  );
}

export default PurchaseCredit;
