import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import './PurchaseCredit.css';
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
   <section className="py-10 bg-white" id="pricing-section">
  <div className="max-w-6xl mx-auto px-4">
    {errors.message && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{errors.message}</div>}
    {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>}

    <div className="flex flex-col md:flex-row justify-between items-start mb-10">
      <div>
        <h3 className="text-2xl font-semibold text-gray-800">Choose Plan</h3>
        <p className="text-gray-600 mt-2">
          Flexible options: one-time credits or recurring subscriptions.
        </p>
      </div>

      <div className="text-right mt-6 md:mt-0">
        <h3 className="text-2xl font-semibold text-gray-800">Current Balance</h3>
        <p className="text-gray-600 mt-2">{userDetails.credits} Credits</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Credit Packs */}
      <div className="border rounded-lg p-6 text-center shadow-sm">
        <div className="mb-4">
          <p className="text-lg font-bold text-blue-600">Credit Packs</p>
        </div>
        <ul className="mb-4 space-y-2">
          {CREDIT_PACKS.map((c) => (
            <li key={c} className="text-gray-700">
              {c} CREDITS FOR ₹{c}
            </li>
          ))}
        </ul>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Buy Credits
        </button>
      </div>

      {/* Monthly Plan */}
      <div className="border rounded-lg p-6 text-center shadow-sm">
        <div className="mb-4">
          <p className="text-lg font-bold text-blue-600">₹199/month</p>
        </div>
        <ul className="mb-4 space-y-2">
          {pricingList[1].list.map((item, i) => (
            <li key={i} className="text-gray-700">
              {item.detail}
            </li>
          ))}
        </ul>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleSubscribe('UNLIMITED_MONTHLY')}
        >
          Subscribe Monthly
        </button>
      </div>

      {/* Yearly Plan */}
      <div className="border rounded-lg p-6 text-center shadow-sm">
        <div className="mb-4">
          <p className="text-lg font-bold text-blue-600">₹1990/year</p>
        </div>
        <ul className="mb-4 space-y-2">
          {pricingList[2].list.map((item, i) => (
            <li key={i} className="text-gray-700">
              {item.detail}
            </li>
          ))}
        </ul>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleSubscribe('UNLIMITED_YEARLY')}
        >
          Subscribe Yearly
        </button>
      </div>
    </div>

    {/* Modal Replacement */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-center mb-4">Buy Credits</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CREDIT_PACKS.map((c) => (
              <button
                key={c}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                onClick={() => handleBuyCredits(c)}
              >
                Buy {c} Credits
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
</section>

  );
}

export default PurchaseCredit;
