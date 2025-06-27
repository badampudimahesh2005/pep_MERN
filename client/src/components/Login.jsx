import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import SERVER_URL from "../utils";

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${SERVER_URL}/auth/login`, userData, { withCredentials: true });
      console.log('Login successful:', response.data);
      dispatch(setUser(response.data.userDetails));
      setError(null);
      setUserData({
      email: '',
      password: ''
    });
    } catch (error) {
      if(error?.response?.status === 401) {
        setError('Invalid email or password');
      }else{
        console.error('Login failed:', error);
        setError('Something went wrong with login');
      }
    }
  };

  
  const handleGoogleSignIn = async (authResponse) => {
    try {
      const response = await axios.post(`${SERVER_URL}/auth/google-login`, {
        idToken: authResponse.credential
      }, { withCredentials: true });
      console.log('Google login successful:', response.data);
      dispatch(setUser(response.data.userDetails));
      setError(null);
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Something went wrong with Google login');
    }
  }
   


  const validateForm = () => {
    if (!userData.email || !userData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10 ">
      <h1 className="text-xl text-center font-bold mb-4">Login Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
       
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          name="email" 
          value={userData.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
       <div className="relative mb-4">
         <label className="block mb-2">Password:</label>
        <input
          type={passwordVisible ? "text" : "password"}
          name="password" 
          value={userData.password}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="absolute inset-y-0 top-7 cursor-pointer right-3 flex items-center text-gray-500"
        >
          {passwordVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
       </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Link to="/register" className=" mb-4">Don't have an account?<span className="text-blue-500 hover:underline"> Register here</span></Link>
        <button type="submit" className="bg-[#0d1b2a] text-white p-2 rounded cursor-pointer hover:bg-gray-700 mb-4">Login</button>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => setError('Google login failed')}
            className="mt-4"
          />
        </GoogleOAuthProvider>
      </form>
    </div>
  );
};

export default Login;