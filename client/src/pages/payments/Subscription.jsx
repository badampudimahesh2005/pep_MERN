import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import SERVER_URL from '../../utils';

function formatDate(isoDateString) {
  if (!isoDateString) return '';

  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Invalid date:', isoDateString);
    return '';
  }
}

function Subscription() {
  const userDetails = useSelector((state) => state.user);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const subscription = userDetails.subscription;

  const handleCancel = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/payments/cancel-subscription`, {
        subscription_id: userDetails.subscription?.id
      }, {
        withCredentials: true
      });

      console.log(response);
      setMessage('Subscription cancelled, it can take up to 5 minutes to reflect the status');
    } catch (error) {
      console.log(error);
      setErrors({ message: 'Unable to cancel subscription' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {errors.message && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {errors.message}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <div className="flex justify-center">
        <div className="w-full md:w-2/3">
          <div className="bg-white border rounded-lg shadow-md w-full mb-6 p-6">
            <h3 className="text-xl font-semibold mb-4">Subscription Summary</h3>
            <hr className="mb-4" />
            <div className="space-y-2 text-gray-800">
              <div>
                <strong>Start Date:</strong> {formatDate(subscription.start)}
              </div>
              <div>
                <strong>End Date:</strong> {formatDate(subscription.end)}
              </div>
              <div>
                <strong>Last Payment Date:</strong> {formatDate(subscription.lastBillDate)}
              </div>
              <div>
                <strong>Next Payment Date:</strong> {formatDate(subscription.nextBillDate)}
              </div>
              <div>
                <strong>Total Payments Made:</strong> {subscription.paymentsMade}
              </div>
              <div>
                <strong>Payments Remaining:</strong> {subscription.paymentsRemaining}
              </div>
            </div>
            <hr className="my-4" />
            <div className="text-center">
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Subscription;
