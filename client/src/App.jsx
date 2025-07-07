import { Routes, Route, Navigate } from 'react-router-dom'
import {  useEffect, useState } from 'react'
import axios from 'axios'


import Login from './pages/Login'
import Register from './pages/Register'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Spinner from './components/Spinner'
import ManageUsers from './pages/users/ManageUsers'
import ManagePayments from './pages/payments/ManagePayments'

import {useDispatch, useSelector} from 'react-redux'
import { setUser } from './store/slices/userSlice'
import SERVER_URL from './utils'
import Home from './pages/Home'
import UserLayout from './layout/UserLayout'

import ProtectedRoute from './rbac/ProtectedRoute'
import UnauthorizedAccess from './components/UnauthorizedAccess'


const App = () => {

  const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);


  // Check if user is logged in by making an API call
  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/auth/check`, { withCredentials: true });
      if (response.data.isLoggedIn) {
        dispatch(setUser(response.data.userDetails));
      }
    } catch (error) {
      dispatch(setUser(null));
    }finally {
      setLoading(false);
    }
  };

  // Call the function to check user login status when the app loads
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  if (loading) {
    return <Spinner />;
  } 

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

      <Route path='/users' element={
        userDetails
        ? <ProtectedRoute roles={['admin']}>
          <UserLayout>
            <ManageUsers />
          </UserLayout>
        </ProtectedRoute>
        : <Navigate to='/login' />
      } />

      <Route path='/unauthorized' element={
        userDetails
        ? <UserLayout>
          <UnauthorizedAccess />
        </UserLayout>
        : <Navigate to='/login' />
      } />

      <Route path='/dashboard' element={
        userDetails
        ? <UserLayout> 
          <Dashboard /> 
        </UserLayout>
        : <Navigate to='/login' />
      } />

      <Route path='/manage-payment' element={
        userDetails
        ? <UserLayout>
          <ManagePayments />
        </UserLayout>
        : <Navigate to='/login' />
      } />
      
      <Route path="*" element={<AppLayout> <h1 className="text-2xl text-center mt-10">404 Not Found</h1> </AppLayout>} />
    </Routes>
  )
}

export default App