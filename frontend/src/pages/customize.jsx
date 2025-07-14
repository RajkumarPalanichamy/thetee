import React, { useState } from 'react'
import {
  FaWhatsapp, FaTshirt, FaPalette, FaMagic, FaUsers,
  FaBoxOpen, FaChevronDown, FaChevronUp, FaImage, FaUser,
  FaCreditCard, FaCcVisa, FaCcMastercard, FaGooglePay,
  FaArrowRight, FaCheckCircle
} from 'react-icons/fa'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import { SiPaytm, SiRazorpay, SiPhonepe } from "react-icons/si";
import Customize1 from "../assets/AddYourLogoHere.png"
import Customize2 from "../assets/Customizedesign.png"

const customizationOptions = [
  {
    id: 1,
    title: 'Custom T-Shirts',
    description: 'Design your perfect t-shirt with our premium customization options.',
    icon: <FaTshirt className="text-3xl" />,
    features: ['Custom designs', 'Logo printing', 'Text & graphics', 'Multiple colors'],
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Custom Hoodies',
    description: 'Create stylish hoodies with your unique designs and branding.',
    icon: <FaPalette className="text-3xl" />,
    features: ['Premium quality', 'Custom embroidery', 'Logo placement', 'Color options'],
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Oversized T-Shirts',
    description: 'Trendy oversized t-shirts with your custom designs.',
    icon: <FaMagic className="text-3xl" />,
    features: ['Modern fit', 'Custom graphics', 'Premium fabric', 'Multiple sizes'],
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 4,
    title: 'Photo T-Shirts',
    description: 'Print your favorite photos on high-quality t-shirts.',
    icon: <FaImage className="text-3xl" />,
    features: ['Photo printing', 'HD quality', 'Multiple sizes', 'Fast delivery'],
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 5,
    title: 'Logo T-Shirts',
    description: 'Professional logo printing for your brand or business.',
    icon: <FaUser className="text-3xl" />,
    features: ['Logo placement', 'Brand colors', 'Quality printing', 'Bulk orders'],
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 6,
    title: 'Unique Design',
    description: 'Bring your custom artwork and creative ideas to life on apparel.',
    icon: <FaMagic className="text-3xl" />,
    features: ['Your artwork', 'Creative concepts', 'Personalized touch', 'Expert guidance'],
    gradient: 'from-yellow-500 to-yellow-600'
  }
];

const faqData = [
  {
    question: "What customization options are available?",
    answer: "We offer a wide range of customization options including custom designs, logos, text, colors, and sizes."
  },
  {
    question: "What is the minimum order quantity for bulk orders?",
    answer: "The minimum order quantity for bulk orders is 50 pieces."
  },
  {
    question: "How long does it take to complete a custom order?",
    answer: "Standard orders take 7-10 business days. Bulk orders may take 2-3 weeks."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards, bank transfers, and digital payments."
  },
  {
    question: "Do you offer sample t-shirts before bulk orders?",
    answer: "Yes, we provide samples before bulk production."
  },
  {
    question: "What is your return policy for custom t-shirts?",
    answer: "We don't accept returns for custom items but replace defective products."
  }
];

const Customize = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleFaq = (index) => setOpenFaqIndex(index === openFaqIndex ? null : index);

  const handleBulkOrderEnquiry = () => {
    const message = `I'm interested in placing a bulk order for custom t-shirts. Please provide the details.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAzMGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptLTMwIDBjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Customize Your Style
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your ideas into wearable art with our premium customization services
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://wa.me/919042942974?text=Hi, I'm interested in customizing apparel. Please provide more details."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Start Customizing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customizationOptions.map((option) => (
            <div
              key={option.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                hoveredCard === option.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onMouseEnter={() => setHoveredCard(option.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="p-6 relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${option.gradient} text-white mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/919042942974?text=Hi, I'm interested in ${encodeURIComponent(option.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r ${option.gradient} text-white font-semibold hover:opacity-90 transition-all duration-300`}
                >
                  <FaWhatsapp className="mr-2" />
                  Enquire Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Order Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Bulk Order Enquiry</h2>
                <p className="text-gray-600 mb-8">
                  Looking to place a bulk order for your team, event, or business? We offer competitive pricing, premium quality, and fast turnaround times for bulk orders.
                </p>
                <button
                  onClick={handleBulkOrderEnquiry}
                  className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  Enquire via WhatsApp
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-white text-center">
                  <FaUsers className="text-6xl mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold mb-2">Team Orders</h3>
                  <p className="text-blue-100">Perfect for corporate events, sports teams, and group activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                <span className={`transform transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                  <FaChevronDown className="text-gray-500" />
                </span>
              </button>
              {openFaqIndex === index && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Secure Payment Methods</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <SiPaytm className="text-5xl text-blue-600" title="Paytm" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <SiRazorpay className="text-5xl text-blue-800" title="Razorpay" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <SiPhonepe className="text-5xl text-purple-700" title="PhonePe" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <FaCcVisa className="text-5xl text-blue-700" title="Visa" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <FaCcMastercard className="text-5xl text-red-600" title="Mastercard" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <FaGooglePay className="text-5xl text-[#5F6368]" title="Google Pay" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <FaCreditCard className="text-5xl text-blue-600" title="Debit/Credit Card" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize; 