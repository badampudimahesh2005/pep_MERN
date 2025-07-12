import { useState, useRef, useEffect } from 'react';
import SERVER_URL from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearUser } from '../store/slices/userSlice';
import {  EllipsisVertical } from 'lucide-react';
import ResetPassword from '../pages/ResetPassword';


export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [message, setMessage] = useState('');
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

  const handleResetPassword = async () => {
    try {
      setIsOpen(false);
      
      // Call the send reset token API
      await axios.post(`${SERVER_URL}/auth/send-reset-token`, {
        email: user.email
      });

      setMessage('Reset code sent to your email!');
      setShowResetPassword(true);

    } catch (error) {
      console.error('Error sending reset token:', error);
      setMessage('Failed to send reset code. Please try again.');
    }
  };

  const handleResetSuccess = (successMessage) => {
    setMessage(successMessage);
    setShowResetPassword(false);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <div>
      {/* Success/Error Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md ${
          message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reset Password</h3>
              <button
                onClick={() => setShowResetPassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <ResetPassword 
              hideEmailField={true} 
              onSuccess={handleResetSuccess}
            />
          </div>
        </div>
      )}

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

    </div>

  );
}
