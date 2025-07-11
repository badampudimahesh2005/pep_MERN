import { useState, useRef, useEffect } from 'react';
import SERVER_URL from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearUser } from '../store/slices/userSlice';
import {  EllipsisVertical } from 'lucide-react';


export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user=useSelector((state) => state.user);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-md bg-[#432dd7] px-2 py-1 text-sm font-medium text-white shadow hover:bg-[#432dd7]/90 "
      >
        {user ? user.username.split(" ")[0] : 'User'}
        <span className="text-white/75"><EllipsisVertical /></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">Account settings</a>
            </li>
            <li>
              <Link to='/dashboard' className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
            </li>
           
            <li>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Sign out</button>
            </li>
             
          </ul>
        </div>
      )}
    </div>
  );
}
