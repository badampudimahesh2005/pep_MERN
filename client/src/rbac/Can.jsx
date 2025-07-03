import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "./Permissions";


function Can({ permission, children }) {

    const user = useSelector((state) => state.user);
    const userPermissions = ROLE_PERMISSIONS[user?.role] || {};
    console.log(userPermissions);
    console.log(user);

    return userPermissions[permission] ? children : null;
}

export default Can;