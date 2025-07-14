import React, { useEffect } from 'react';
import Title from '../components/Title';
import about from '../assets/AboutFinal2.png';
import { Helmet } from 'react-helmet';
const About = () => {
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="px-4 md:px-12 lg:px-20 mt-40">
      {/* MAIN PAGE HEADING */}
      
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>About Us - The Tee</title>
        <meta name="description" content="Learn more about The Tee — our mission, values, and passion for stylish, comfortable fashion." />
        <meta name="keywords" content="About The Tee, The Tee mission, online shopping India, fashion, ecommerce" />
        <meta property="og:title" content="About Us - The Tee" />
        <meta property="og:description" content="Get to know The Tee - a brand dedicated to comfort, style, and customer satisfaction." />
        <meta property="og:url" content="https://thetee.in/about" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thetee.in/about" />
      </Helmet>
      {/* ABOUT US SECTION */}
      <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight pl-4">
        <span className="text-black bg-clip-text uppercase">About Us</span>
      </h2>

      <div className="my-14 flex flex-col md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-md rounded-xl shadow-md"
          src={about}
          alt="About TheTee"
        />
        <div className="flex flex-col justify-center gap-6 text-gray-700 md:w-3/5">
          <p className="leading-relaxed text-[15px]">
            <b className="text-gray-900">Welcome to TheTee</b> — your trusted online shopping destination. 
            TheTee was born out of a passion for <span className="font-semibold">innovation</span>, 
            <span className="font-semibold"> style</span>, and a desire to revolutionize how people experience e-commerce. 
            Our goal is to create a reliable and intuitive platform where customers can explore and purchase 
            <span className="font-semibold"> trending products</span> from the comfort of home.
          </p>
          <p className="leading-relaxed text-[15px]">
            We work tirelessly to curate a <span className="font-semibold">diverse collection</span> of stylish and useful products 
            — from <span className="font-semibold">fashion and lifestyle</span> to <span className="font-semibold">tech gadgets</span> and 
            <span className="font-semibold"> home decor</span>, all sourced from <span className="font-semibold">trusted brands</span>.
          </p>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Our Mission</h3>
            <p className="leading-relaxed text-[15px]">
              Our mission is to <span className="font-semibold">empower customers</span> with 
              <span className="font-semibold"> choice, confidence, and convenience</span>. We ensure a seamless shopping experience— 
              from browsing to delivery and after-sales support.
            </p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight pl-4">
        <span className="text-black bg-clip-text uppercase">Why Choose Us</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 mt-10">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h4 className="text-lg font-bold mb-3">Quality Assurance</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every product is carefully selected to meet our strict quality standards, delivering 
            <span className="font-semibold text-gray-800"> reliable</span> and 
            <span className="font-semibold text-gray-800"> premium-grade</span> merchandise.
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h4 className="text-lg font-bold mb-3">Convenience</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our <span className="font-semibold text-gray-800">user-friendly interface</span> and 
            <span className="font-semibold text-gray-800"> fast delivery system</span> make shopping at TheTee 
            effortless and enjoyable.
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h4 className="text-lg font-bold mb-3">Exceptional Service</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our <span className="font-semibold text-gray-800">dedicated support team</span> is always ready 
            to assist you with queries, returns, or updates. Your satisfaction is our top priority.
          </p>
        </div>
      </div>

      {/* OUR VALUES SECTION */}
      <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight pl-4">
        <span className="text-black bg-clip-text uppercase">Our Values</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-20">
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h4 className="text-lg font-bold mb-2">Customer First</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every decision we make starts with our customers in mind. Your happiness and satisfaction fuel our growth.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h4 className="text-lg font-bold mb-2">Transparency</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            We believe in open communication, honest pricing, and full visibility in everything we do.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h4 className="text-lg font-bold mb-2">Innovation</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            We embrace change, adopt new technology, and constantly refine our services to better serve you.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h4 className="text-lg font-bold mb-2">Community</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            We support small businesses, local artists, and eco-friendly practices that give back to the community.
          </p>
        </div>
      </div>

      {/* CUSTOMER COMMITMENT SECTION */}
      <div className="mb-20">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight pl-4">
          <span className="text-black bg-clip-text uppercase">Customer Commitment</span>
        </h2>
        <p className="text-center text-gray-700 mt-6 text-[15px] max-w-3xl mx-auto leading-relaxed">
          Whether you're making your first purchase or are a returning customer, we treat every order with care and attention. 
          At TheTee, we don't just sell products — we build lasting relationships. Join our growing community and experience 
          a new way to shop, where your needs come first.
        </p>
      </div>
    </div>
  );
};

export default About;
