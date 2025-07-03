import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//roles will be array of roles that are allowed to render/visit children component

function ProtectedRoute({ children, roles }) {

    const userDetails = useSelector((state) => state.user);

    return roles.includes(userDetails?.role) ? (
        children
    ) : (
        <Navigate to="/unauthorized" replace />
    );

}

export default ProtectedRoute;