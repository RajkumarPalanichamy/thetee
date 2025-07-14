import React, { useState, useEffect } from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTag } from 'react-icons/fa';
import { FaPhone } from "react-icons/fa6";

const offers = [
  "Buy 4 T-Shirts @999 only",
  "Pick Any 4 T-Shirts @899 only",
  "Get Upto 38% Discount On Combos!",
  "New Collection Launched - Check it Out!",
  "Limited Offer!",
];

const Offers = () => {
  const [currentOffer, setCurrentOffer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 3000); // every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-700 to-red-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        
        {/* Social Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://www.instagram.com/the_tee_offcl?igsh=a3R2dm0xa3k0bG5y"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
         
          <a
            href="https://wa.me/919042942974"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
        </div>

        {/* Scrolling Offers */}
        <div className="flex-grow relative h-6 overflow-hidden text-center">
          <div
            className="absolute w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentOffer * 1.5}rem)` }}
          >
            {offers.map((offer, index) => (
              <div
                key={index}
                className="h-6 flex items-center justify-center"
              >
                <FaTag className="mr-2 text-yellow-300" />
                <span className="text-sm font-medium">{offer}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-sm hidden md:flex items-center">
          <a 
            href="https://wa.me/919042942974" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition flex items-center"
          >
            <FaPhone className="mr-2 w-5 h-5" />
            +91 9042942974
          </a>
        </div>
      </div>
    </div>
  );
};

export default Offers;
