import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import SERVER_URL from '../../utils';

const ResetPassword = ({ hideEmailField = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // Set email from location state (when coming from ForgetPassword)
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
    // Set email from user object (when user is logged in)
    else if (hideEmailField && user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [location.state, hideEmailField, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.code || !formData.newPassword) {
      setError('All fields are required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.code.length !== 6 || !/^\d+$/.test(formData.code)) {
      setError('Reset code must be 6 digits');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(`${SERVER_URL}/auth/reset-password`, {
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      });

      console.log('Password reset successful:', response.data);
      
      // Call onSuccess callback if provided (for dashboard usage)
      if (onSuccess) {
        onSuccess('Password reset successfully!');
      } else {
        // Navigate to login page with success message
        navigate('/login', { 
          state: { 
            message: 'Password reset successfully! Please login with your new password.' 
          } 
        });
      }

    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response?.status === 400) {
        setError(error.response.data.message);
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${hideEmailField ? '' : 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'}`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the reset code and your new password
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Field - Hidden when user is logged in */}
          {!hideEmailField && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none  sm:text-sm"
                placeholder="Email address"
              />
            </div>
          )}

          {/* Reset Code Field */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Reset Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength="6"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm"
              placeholder="Enter 6-digit code"
            />
          </div>

          {/* New Password Field */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="newPassword"
                name="newPassword"
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none sm:text-sm"
                placeholder="New password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {passwordVisible ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer ${
                loading
                  ? 'bg-[#0d1b2a]/75 cursor-not-allowed'
                  : 'bg-[#0d1b2a] hover:bg-[#0d1b2a]/80'
              } focus:outline-none `}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          {!hideEmailField && (
            <div className="text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Back to Login
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
