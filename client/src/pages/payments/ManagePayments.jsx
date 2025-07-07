import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import SERVER_URL, {CREDIT_PACKS} from '../../utils';
import { setUser } from '../../store/slices/userSlice';

function ManagePayments() {
  const user = useSelector((state) => state.user);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loadingCredits, setLoadingCredits] = useState(null); // Track which button is loading
  const dispatch = useDispatch();

  const handlePayment = async (credits) => {
    try {
      setLoadingCredits(credits); // Set loading for specific credit amount
      setErrors({}); // Clear previous errors
      setMessage(null); // Clear previous messages
      
      

      const { data } = await axios.post(
        `${SERVER_URL}/payments/create-order`,
        { credits },
        { withCredentials: true }
      );

      console.log('Order created successfully:', data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Affiliate++',
        description: `${credits} credits pack`,
        order_id: data.order.id,
        theme: { color: '#3399cc' },
        handler: async (payment) => {
          try {
            const response = await axios.post(
              `${SERVER_URL}/payments/verify-order`,
              {
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
                credits,
              },
              { withCredentials: true }
            );
            console.log('Payment verified successfully:', response.data);
            dispatch(setUser(response.data.user)); // Fixed: use 'user' not 'userDetails'
            setMessage('Credits added successfully');
            setErrors({}); // Clear any errors
          } catch (error) {
            console.error('Payment verification error:', error);
            setErrors({
              message: 'Unable to verify payment. If money was deducted, contact customer support.',
            });
          } finally {
            setLoadingCredits(null); // Clear loading state
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingCredits(null); // Clear loading state if modal is dismissed
          }
        }
      };

      const razorpayPopup = new window.Razorpay(options);
      razorpayPopup.open();
    } catch (error) {
      console.error('Payment creation error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        setErrors({
          message: 'You do not have permission to make payments. Please contact support.',
        });
      } else if (error.response?.status === 401) {
        setErrors({
          message: 'Please login to continue with payment.',
        });
      } else {
        setErrors({
          message: 'Unable to create order. Please try again.',
        });
      }
      setLoadingCredits(null); // Clear loading state on error
    }
  };

  return (
//    <div className="max-w-5xl mx-auto py-10 px-4">
//   {message && (
//     <div className="mb-4 p-4 rounded bg-green-100 text-green-800 border border-green-300">
//       {message}
//     </div>
//   )}
//   {errors.message && (
//     <div className="mb-4 p-4 rounded bg-red-100 text-red-800 border border-red-300">
//       {errors.message}
//     </div>
//   )}

//   <h2 className="text-2xl font-semibold mb-2">Manage Payments</h2>
//   <p className="mb-6">
//     <span className="font-semibold">Credit Balance:</span> {user.credits}
//   </p>

//   <div className="flex flex-wrap gap-4">
//     {CREDIT_PACKS.map((credit) => (
//       <div
//         key={credit.id}
//         className="border rounded p-4 shadow-sm w-64 flex flex-col items-start"
//       >
//         <h4 className="text-lg font-semibold mb-2">{credit.credits} Credits</h4>
//         <p className="mb-4">
//           Buy {credit.credits} Credits for ₹{credit.price}
//         </p>
//         <button
//           className="mt-auto px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
//           onClick={() => handlePayment(credit)}
//           disabled={loading}
//         >
//           Pay
//         </button>
//       </div>
//     ))}
//   </div>
// </div>
<div className="max-w-6xl mx-auto px-6 py-10">
  {/* Alerts */}
  {message && (
    <div className="mb-6 px-6 py-4 rounded-lg bg-green-100 text-green-800 border border-green-300 shadow">
      ✅ {message}
    </div>
  )}
  {errors.message && (
    <div className="mb-6 px-6 py-4 rounded-lg bg-red-100 text-red-800 border border-red-300 shadow">
      ⚠️ {errors.message}
    </div>
  )}

  {/* Header */}
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Payments</h2>
    <p className="text-gray-600 text-lg">
      <span className="font-semibold text-gray-800">Credit Balance:</span>{' '}
      {user.credits}
    </p>
  </div>

  {/* Credit Packs Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {CREDIT_PACKS.map((credits) => (
      <div
        key={credits}
        className="rounded-2xl border bg-white p-4 shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl"
      >
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          {credits} Credits
        </h4>
        <p className="text-gray-600 mb-6">
          Buy <span className="font-semibold">{credits}</span> Credits for{' '}
          <span className="text-blue-600 font-semibold">₹{credits}</span>
        </p>
        <button
          onClick={() => handlePayment(credits)}
          disabled={loadingCredits !== null} // Disable all buttons when any payment is processing
          className={`w-full px-4 py-2 rounded-xl text-white font-medium transition ${
            loadingCredits === credits
              ? 'bg-blue-400 cursor-not-allowed'
              : loadingCredits !== null
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0d1b2a] hover:bg-gray-700'
          }`}
        >
          {loadingCredits === credits ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    ))}
  </div>
</div>


  );
}

export default ManagePayments;
