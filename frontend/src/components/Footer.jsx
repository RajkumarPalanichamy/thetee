import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <h1 className="text-2xl font-bold mb-5">TheTee</h1>
          <p className="w-full md:w-2/3 text-gray-600">
            TheTee is your go-to destination for premium quality oversized t-shirts that blend streetwear style with all-day comfort. Discover minimal designs, versatile colors, and effortless fits made for everyday wear.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li className='cursor-pointer hover:text-black transition-colors' onClick={() => navigate('/')}>Home</li>
            <li className='cursor-pointer hover:text-black transition-colors' onClick={() => navigate('/collection')}>Collections</li>
            <li className='cursor-pointer hover:text-black transition-colors' onClick={() => navigate('/about')}>About</li>
            <li className='cursor-pointer hover:text-black transition-colors' onClick={() => navigate('/contact')}>Contact</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li className='cursor-pointer hover:text-black transition-colors' onClick={() => window.location.href = 'tel:+919042942974'}>+91 90429 42974</li>
            <li className='cursor-pointer hover:text-black transition-colors' onClick={() => window.location.href = 'mailto:thetee545@gmail.com'}>thetee545@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@thetee.in - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
