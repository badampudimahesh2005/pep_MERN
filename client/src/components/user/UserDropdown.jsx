// components/UserDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";
import SERVER_URL from "../../utils";
import { useDispatch } from "react-redux";
import axios from "axios";
import { clearUser } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";


const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/auth/logout`, {}, { withCredentials: true });
      console.log("Logout successful", response.data);
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm font-medium text-white"
      >
        {userDetails ? userDetails.username : "Account"}
        <EllipsisVertical className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black/10 text-sm text-gray-700 z-50">
          <li>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
