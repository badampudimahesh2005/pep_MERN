import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [userDetails, setUserDetails] = useState(null);

  const updateUserDetails = (details) => {
    setUserDetails(details);
  };

  // Check if user is logged in by making an API call
  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/check', { withCredentials: true });
      if (response.data.isLoggedIn) {
        updateUserDetails(response.data.userDetails);
      }
    } catch (error) {
      console.error('Error checking user login status:', error);
      setUserDetails(null);
    }
  };

  // Call the function to check user login status when the app loads
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<AppLayout> <h1 className="text-2xl text-center mt-10">Welcome to the Home Page</h1> </AppLayout>} />

      <Route path="/login" element={
        userDetails 
        ? <Navigate to='/dashboard' /> 
        : <AppLayout> 
          <Login updateUserDetails={updateUserDetails} /> 
          </AppLayout>
        } />

      <Route path="/register" element={userDetails? <Navigate to='/dashboard' /> : <AppLayout> <Register updateUserDetails={updateUserDetails} /> </AppLayout>} />

      <Route path='/dashboard' element={
        userDetails
        ? <AppLayout> <Dashboard userDetails={userDetails} /> </AppLayout>
        : <Navigate to='/login' />
      } />
      
      <Route path="*" element={<AppLayout> <h1 className="text-2xl text-center mt-10">404 Not Found</h1> </AppLayout>} />
    </Routes>
  )
}

export default App