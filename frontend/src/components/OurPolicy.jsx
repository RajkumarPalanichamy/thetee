import React from 'react'
import { assets } from '../assets/assets'
import {
  FaGooglePay,
  FaPhone,
  FaCcVisa,
  FaCcMastercard,
  FaWallet,
  FaMoneyCheckAlt
} from 'react-icons/fa';
import { SiPaytm, SiRazorpay, } from 'react-icons/si';


const OurPolicy = () => {
  return (
     <div className="px-4 md:px-12 lg:px-20 py-20">
      {/* Policy Items */}
      <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center text-xs sm:text-sm md:text-base text-gray-700 mb-16'>
        <div>
          <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
          <p className='font-semibold'>Easy Exchange Policy</p>
          <p className='text-gray-500 text-sm'>We offer hassle free exchange policy</p>
        </div>
        <div>
          <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
            <p className="font-semibold">Replacement Policy</p>
    <p className="text-gray-500 text-sm"> Exchange Product within 2 days of delivery.</p>
        </div>
        <div>
          <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
          <p className='font-semibold'>Best Customer Support</p>
          <p className='text-gray-500 text-sm'>We provide 24/7 customer support</p>
        </div>
      </div>

      {/* Homegrown Section */}
      <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row p-6 md:p-10 gap-8 items-center">
        {/* Vision Statement */}
        <div className="flex-1 text-gray-700">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">OUR VISION</h2>
          <p className="mb-2 text-xs sm:text-sm md:text-base">
            In line with our vision, we wish to be recognized as an organization renowned for its creative solutions,
            innovation, and quality.
          </p>
          <p className="text-xs sm:text-sm md:text-base">
            We also aim to re-calibrate the benchmark standards in designing and printing products tailored to meet the
            needs of a diverse customer base.
          </p>
        </div>

        {/* Homegrown Box */}
        <div className="bg-black text-white rounded-lg shadow-2xl p-6 md:p-8 w-full md:w-[500px]">
          <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            <span className="text-orange-400">WE ARE</span> THE TEE
          </h3>
          <ul className="text-xs sm:text-sm md:text-base space-y-2 mb-6 list-disc list-inside text-gray-200">
            <li>Everything is personalised</li>
            <li>Buy 4 T-Shirts @999 only</li>
            <li>Get 38% Discount on Combos</li>
            <li>Guaranteed high quality products</li>
            
          </ul>
          <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-600 pt-4">
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">50k+</p>
              <p className="text-xs sm:text-sm text-gray-300">Happy Customers</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">532+</p>
              <p className="text-xs sm:text-sm text-gray-300">Google Reviews</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">50k+</p>
              <p className="text-xs sm:text-sm text-gray-300">Products Delivered</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">25000+</p>
              <p className="text-xs sm:text-sm text-gray-300">5-Star Ratings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secure Payments Section */}
      <div className="mt-16 border-t pt-10 text-center">
        <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
          100% SECURE PAYMENTS
        </h3>
        <div className="flex justify-center items-center flex-wrap gap-6 md:gap-10 text-6xl">
          <FaGooglePay title="Google Pay" className="text-[#FDBD00]" />
          <SiPaytm title="Paytm" className="text-[#0033a0]" />
          <FaWallet title="Wallet" className="text-yellow-500" />
          <FaCcVisa title="Visa" className="text-[#1a1f71]" />
          <FaCcMastercard title="Mastercard" className="text-[#eb001b]" />
          <FaMoneyCheckAlt title="Netbanking" className="text-green-600" />
          <SiRazorpay title="Razorpay" className="text-[#0f67f6]" />
        </div>
      </div>
    </div>
  )
}

export default OurPolicy
