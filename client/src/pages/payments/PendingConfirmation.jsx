import React from 'react'

const PendingConfirmation = () => {
  return (
  <div className="max-w-2xl mx-auto text-center py-10 px-4">
    <h2 className="text-2xl font-semibold mb-4">Awaiting Payment Confirmation</h2>
    <p className="text-gray-600">
      We're confirming the status of your payment. This may take up to 5 minutes.
    </p>
  </div>
);

}

export default PendingConfirmation