import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaClock, FaWhatsapp, FaReceipt
} from "react-icons/fa";
import contact from "../assets/AboutFinal2.png";

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us - The Tee</title>
        <meta name="description" content="Get in touch with The Tee for any inquiries, orders or support. Call, email or visit us at Tirupur, Tamil Nadu." />
        <meta name="keywords" content="Contact The Tee, The Tee Address, customer support, The Tee phone number, email, WhatsApp, location" />
        <meta property="og:title" content="Contact The Tee - Customer Support" />
        <meta property="og:description" content="Reach out to The Tee for any support or order queries." />
        <meta property="og:url" content="https://thetee.in/contact" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thetee.in/contact" />
      </Helmet>

      <div className="px-4 md:px-20 lg:px-32 mt-32">
        <div className="text-center pt-10">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
            <span className="text-black bg-clip-text ">Contact Us</span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            We'd love to hear from you! Reach out to us anytime.
          </p>
        </div>

        <div className="my-12 flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex flex-col gap-6 w-full md:w-1/2 text-gray-700">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">THE TEE</h2>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-xl text-gray-800 mt-1" />
              <div>
                <p className="font-semibold text-lg">Store Address</p>
                <p>No 16, Singaravelan Nager 3rd Street, Angeripalayam Road, Tirupur - 641 603</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-xl text-gray-800 mt-1" />
              <div>
                <p className="font-semibold text-lg">Phone</p>
                <p>+91 90429 42974</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope className="text-xl text-gray-800 mt-1" />
              <div>
                <p className="font-semibold text-lg">Email</p>
                <p>thetee545@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaClock className="text-xl text-gray-800 mt-1" />
              <div>
                <p className="font-semibold text-lg">Store Hours</p>
                <p>Mon - Sat: 9:00 AM – 9:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaWhatsapp className="text-xl text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-lg">WhatsApp Support</p>
                <p>+91 90429 42974</p>
                <p className="text-sm text-gray-500">
                  Available 24/7 for order or support queries via WhatsApp
                </p>
                <a
                  href="https://wa.me/919042942974"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-md font-semibold shadow hover:bg-green-700 transition duration-300"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaReceipt className="text-xl text-gray-800 mt-1" />
              <div>
                <p className="font-semibold text-lg">GST Number</p>
                <p>33MDZPS6319E1ZR</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <img className="w-full rounded-xl shadow-lg" src={contact} alt="Contact Illustration" />
          </div>
        </div>

        <div className="py-12 mt-10 text-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
            <span className="text-black bg-clip-text ">Visit Our Shop</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 mt-5">
            You're welcome to visit our customization studio for in-person consultations and sample viewing.
          </p>

          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg max-w-4xl mt-10 mx-auto">
            <iframe
              title="Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.3702401976227!2d77.3322411!3d11.1326685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDA3JzU3LjYiTiA3N8KwMjAnMDUuMyJF!5e0!3m2!1sen!2sin!4v1717562632491!5m2!1sen!2sin"
              className="absolute top-0 left-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
