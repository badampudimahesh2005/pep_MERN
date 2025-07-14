import { Routes, Route, Navigate } from 'react-router-dom'
import {  useEffect, useState } from 'react'
import axios from 'axios'


import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgetPassword from './pages/auth/ForgetPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Error from './pages/Error'
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
import AnalyticsDashboard from './pages/links/AnalyticsDashboard'


const App = () => {

  const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);


  const attemptToRefreshToken = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/auth/refresh-token`,{}, { withCredentials: true });
      console.log("Token refreshed successfully:", response.data);
     
      dispatch(setUser(response.data.userDetails));
    } catch (error) {
      console.error("Error refreshing token:", error);
      dispatch(setUser(null));
    }
  };

  // Check if user is logged in by making an API call
  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/auth/check`, { withCredentials: true });
      if (response.data.isLoggedIn) {
        dispatch(setUser(response.data.userDetails));
      }
    } catch (error) {
      if(error.response && error.response.status === 401 && error.response.data.tokenExpired) {
        // If the user is not logged in, try to refresh the token
        await attemptToRefreshToken();
      } else {
        console.error("Error checking user login status:", error);
      }
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

      <Route path="/forget-password" element={
        userDetails
        ? <Navigate to='/dashboard' /> 
        : <AppLayout> 
          <ForgetPassword /> 
        </AppLayout>
      } />

      <Route path="/reset-password" element={
        userDetails
        ? <Navigate to='/dashboard' /> 
        : <AppLayout> 
          <ResetPassword /> 
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

      <Route path='/analytics/:linkId' element={
        userDetails
        ? <UserLayout>
          <AnalyticsDashboard />
        </UserLayout>
        : <Navigate to='/login' />
      } />

      <Route path="/error" element={userDetails ?
        <UserLayout>
          <Error />
        </UserLayout> :
        <AppLayout><Error /></AppLayout>
      } />

      <Route path="*" element={<AppLayout> <Error /></AppLayout>} />
    </Routes>
  )
}

export default App



