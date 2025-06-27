import axios from "axios";
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import SERVER_URL from "../utils";

import { clearUser } from "../store/slices/userSlice";
import Dropdown from "./Dropdown";



const Header = () => {

  const user = useSelector((state) => state.user);

  return (
    <>

    <nav className="bg-white p-4 shadow-md">
      <div className="container flex justify-between items-center px-5 mx-auto">
        <div className="text-[#0d1b2a]/90 text-lg font-bold">
          <Link to="/" >Affiliate</Link>
        </div>
        <div className="space-x-5">

          {user ?
              <Dropdown />

          :(
            <>
              <Link to="/login" className="text-gray-700 hover:text-[#0d1b2a]">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-[#0d1b2a]">Register</Link>
            </>
          )}
          
        </div>
      </div>

    </nav>
    </>
  )
}

export default Header