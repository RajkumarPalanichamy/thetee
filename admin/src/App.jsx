import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', token);
    if (token === '') {
      setIsValid(false);
      setIsLoading(false);
      return;
    }
    // Verify token with backend
    const verifyToken = async () => {
      try {
        const response = await fetch(backendUrl + '/api/order/list', {
          method: 'POST',
          headers: { 'token': token },
        });
        const data = await response.json();
        if (data.success) {
          setIsValid(true);
        } else {
          setIsValid(false);
          setToken('');
          localStorage.removeItem('token');
        }
      } catch (err) {
        setIsValid(false);
        setToken('');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  if (isLoading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {!isValid
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App