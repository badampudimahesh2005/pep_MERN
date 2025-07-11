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

    <nav className="bg-[#0d1b2a] p-4 shadow-md">
      <div className="container flex justify-between items-center px-5 mx-auto">
        <div className="text-white text-lg font-bold">
          <Link to="/" >Affiliate</Link>
        </div>
        <div className="space-x-5">

          {user ?
              <Dropdown />

          :(
            <>
              <Link to="/login" className="text-white/75 hover:text-white">Login</Link>
              <Link to="/register" className="text-white/75 hover:text-white">Register</Link>
            </>
          )}
          
        </div>
      </div>

    </nav>
    </>
  )
}

export default Header