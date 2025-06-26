import axios from "axios";
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import SERVER_URL from "../utils";

import { clearUser } from "../store/slices/userSlice";



const Header = () => {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
    const response = await axios.post(`${SERVER_URL}/auth/logout`, {}, { withCredentials: true });
    console.log("Logout successful", response.data);
    dispatch(clearUser());
    navigate("/");
    
    } catch (error) {
      console.error("Logout failed", error);
    } 
  }


  return (
    <>

    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-pink-500 text-lg font-bold">
          <Link to="/" >E-Commerce</Link>
        </div>
        <div className="space-x-4">

          {user ?
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-pink-500">Dashboard</Link>
              <button onClick={handleLogin} className="text-gray-700 hover:text-pink-500">Logout</button>
            </>
          :(
            <>
              <Link to="/login" className="text-gray-700 hover:text-pink-500">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-pink-500">Register</Link>
            </>
          )}
          
        </div>
      </div>

    </nav>
    </>
  )
}

export default Header