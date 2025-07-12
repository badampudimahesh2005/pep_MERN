import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from '../utils';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(`${SERVER_URL}/auth/send-reset-token`, {
        email
      });

      console.log('Reset token sent successfully:', response.data);
      
      // Navigate to reset password page with email
      navigate('/reset-password', { state: { email } });

    } catch (error) {
      console.error('Error sending reset token:', error);
      if (error.response?.status === 404) {
        setError('No account found with this email address');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a reset code
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" rounded-full relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-900 sm:text-sm outline-none"
              placeholder="Email address"
            />
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
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </div>

          <div className="text-center  ">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
