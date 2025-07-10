import { useSelector } from "react-redux";

import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";
import PendingConfirmation from "./PendingConfirmation";


const ManagePayments = () => {

  const userDetails = useSelector((state) => state.user);

  const confirmationStatus = [
    'created',
    'pending',
    'authenticated',
  ];

  if(userDetails.Subscription?.status === 'active') {
    return <Subscription />;
  }
  else if(confirmationStatus.includes(userDetails.Subscription?.status)) {
    return <PendingConfirmation />;
  }
  else  {
    return <PurchaseCredit />;
  }

};

export default ManagePayments;