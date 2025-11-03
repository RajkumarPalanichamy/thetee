import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import { FaPhone } from "react-icons/fa6"
import { FaWhatsapp } from 'react-icons/fa'
import Offers from './components/Offers'
import { FaInstagram } from "react-icons/fa";


const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 text-center px-6">
    <p className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-3">
      Welcome to <span className="text-red-600 font-bold">The Tee</span>
    </p>
  
    <p className="text-lg sm:text-xl text-gray-700 italic mb-2 tracking-wide">
  Everyday Fashion, <span className="text-red-600 font-medium">Real Savings!</span>
</p>

  
    <p className="text-base sm:text-lg text-blue-600 font-semibold mb-8">
       Buy 4 T-Shirts @ <span className="text-red-600">₹999</span> – Limited Time Offer!
    </p>
  
    <div className="scale-110">
      <l-waveform
        size="60"
        stroke="3.5"
        speed="1"
        color="#2563eb"
      ></l-waveform>
    </div>
  </div>
  


  )
}


  return (
    <div>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer />
        <Offers />
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
        <Footer />
      </div>

      {/* WhatsApp Floating Icon */}
      {/* <div className="fixed bottom-5 right-5 flex items-center justify-center z-50">
        <div className="absolute w-16 h-16 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <a
          href="https://wa.me/919042942974?text=Hi,I’m interested in bulk orders,please provide details!"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center bg-green-500 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp size={30} className="text-white" />
        </a>
      </div> */}

      {/* Phone Floating Icon */}
      {/* <div className="fixed bottom-24 right-5 flex items-center justify-center z-50">
        <div className="absolute w-16 h-16 bg-blue-600 rounded-full animate-ping opacity-75"></div>
        <a
          href="tel:+919042942974"
          className="relative flex items-center justify-center bg-blue-600 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
          title="Call for Bulk Order"
        >
          <FaPhone size={30} className="text-white" />
        </a>
      </div> */}

      <div className="fixed bottom-5 sm:bottom-6 right-5 flex items-center justify-center z-50">
  <div className="absolute w-16 h-16 bg-pink-500 rounded-full animate-ping opacity-75"></div>
  <a
    href="https://www.instagram.com/the_tee_offcl?igsh=OGNhenFueTBtcW1n" // replace with your Instagram link
    target="_blank"
    rel="noopener noreferrer"
    className="relative flex items-center justify-center bg-pink-500 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
    title="Visit our Instagram"
  >
    <FaInstagram size={30} className="text-white" />
  </a>
</div>
    </div>

    
  )
}

export default App;
