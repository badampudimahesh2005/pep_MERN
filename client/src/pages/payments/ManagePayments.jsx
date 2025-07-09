import { useSelector } from "react-redux";

import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";


const ManagePayments = () => {

  const userDetails = useSelector((state) => state.user);

  if(userDetails.Subscription?.status === 'active') {
    return <Subscription />;
  }
  else {
    return <PurchaseCredit />;
  }

};

export default ManagePayments;