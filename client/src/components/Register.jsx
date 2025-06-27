
import axios from 'axios';
import {useState} from 'react';
import { Eye, EyeOff } from 'lucide-react'; 
import { setUser } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import SERVER_URL from '../utils';
import { Link } from 'react-router-dom';



const Register = () => {

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try{

      const response = await axios.post(`${SERVER_URL}/auth/signup`, userData, { withCredentials: true });
      console.log("register successful", response.data);
      dispatch(setUser(response.data.userDetails));
      setError(null);
      setUserData({
        username: '',
        email: '',
        password: ''
      });


    }catch(error){
      setError(error.message? error.message:"Registration failed. Please try again later." );
    }
  }

  const validateForm = () => {
    if (!userData.username || !userData.email || !userData.password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  return (
    <div className='bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10 '>
      <h1 className='text-xl text-center mb-4 font-bold'>Register</h1>
      <form onSubmit={handleSubmit} className='flex flex-col '>

        <label htmlFor="username" className='block mb-2'>Name:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={userData.username}
          onChange={handleChange}
          className='border border-gray-300 p-2 rounded w-full mb-4'
          required
        />
        <label htmlFor="email" className='block mb-2'>Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          className='border border-gray-300 p-2 rounded w-full mb-4'
          required
        />
        <div className='relative mb-4'>
          <label htmlFor="password" className='block mb-2'>Password:</label>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            className='border border-gray-300 p-2 rounded w-full mb-4'
            required
          />
          <button 
      type="button"
      onClick={() => setPasswordVisible(!passwordVisible)}
      className="absolute inset-y-0 top-7 cursor-pointer right-3 flex items-center text-gray-500"
      >
        {passwordVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
      </button>
          
        </div>
       
        {error && <p className='text-red-500 mb-4'>{error}</p>}
         <Link to="/login" className=" mb-4">Already have an account?<span className="text-blue-500 hover:underline"> Login here</span></Link>
        <button type="submit" className='bg-[#0d1b2a] text-white p-2 rounded hover:bg-gray-700 cursor-pointer'>Register</button>

      </form>
    </div>
  )
}

export default Register

