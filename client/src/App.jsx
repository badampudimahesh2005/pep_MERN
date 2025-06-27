import { Routes, Route, Navigate } from 'react-router-dom'
import {  useEffect } from 'react'
import axios from 'axios'


import Login from './pages/Login'
import Register from './pages/Register'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'

import {useDispatch, useSelector} from 'react-redux'
import { setUser } from './store/slices/userSlice'
import SERVER_URL from './utils'
import Home from './pages/Home'

const App = () => {

  const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();



  // Check if user is logged in by making an API call
  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/auth/check`, { withCredentials: true });
      if (response.data.isLoggedIn) {
        dispatch(setUser(response.data.userDetails));
      }
    } catch (error) {
      dispatch(setUser(null));
    }
  };

  // Call the function to check user login status when the app loads
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <Routes>

      <Route path="/" element={
        <AppLayout> 
          <Home /> 
        </AppLayout>
      } />

      <Route path="/login" element={
        userDetails 
        ? <Navigate to='/dashboard' /> 
        : <AppLayout> 
          <Login /> 
          </AppLayout>
        } />

      <Route path="/register" element={
        userDetails
        ? <Navigate to='/dashboard' /> 
        : <AppLayout> 
          <Register /> 
        </AppLayout>
      } />

      <Route path='/dashboard' element={
        userDetails
        ? <AppLayout> 
          <Dashboard /> 
        </AppLayout>
        : <Navigate to='/login' />
      } />
      
      <Route path="*" element={<AppLayout> <h1 className="text-2xl text-center mt-10">404 Not Found</h1> </AppLayout>} />
    </Routes>
  )
}

export default App