import React, { useState, useEffect } from "react";
import Hero1 from "../assets/Banner.webp";
import Hero2 from "../assets/banner3.webp";
import Hero3 from "../assets/Banner21.webp"; // <- New banner image
import Hero4 from "../assets/Banner22.webp"; // <- Second slideshow image
import { Link } from "react-router-dom";

const Hero = () => {
  const [imageLoaded1, setImageLoaded1] = useState(false);
  const [imageLoaded2, setImageLoaded2] = useState(false);
  const [imageLoaded3, setImageLoaded3] = useState(false);
  const [imageLoaded4, setImageLoaded4] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow images and content
  const slideData = [
    {
      image: Hero3,
      title: "Get any 4 Premium Casual T-Shirts",
      subtitle: "at ₹899",
      description: "Exclusive designs just dropped — grab the",
      highlight: "Best Deal",
      buttonText: "Shop Now",
      imageLoaded: imageLoaded3,
      setImageLoaded: setImageLoaded3
    },
    {
      image: Hero4,
      title: "Get any 4 Premium Casual T-Shirts",
      subtitle: "at ₹899",
      description: "Exclusive designs just dropped — grab the",
      highlight: "Best Deal",
      buttonText: "Shop Now",
      imageLoaded: imageLoaded4,
      setImageLoaded: setImageLoaded4
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [slideData.length]);

  return (
    <>
      {/* Banner 1: Combo T-Shirts at ₹999 */}
      <section className="relative overflow-hidden mt-32 rounded-lg z-10 h-[70vh] sm:h-[80vh] md:h-[90vh] bg-white sm:bg-transparent">
        {!imageLoaded1 && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />}
        <img
          src={Hero1}
          alt="Combo Offer"
          onLoad={() => setImageLoaded1(true)}
          className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${
            imageLoaded1 ? "opacity-100" : "opacity-0"
          } object-contain sm:object-cover rounded-lg`}
        />
        <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Small Screen Content */}
        <div className="sm:hidden absolute top-9 left-0 p-3 right-0 z-20 flex justify-center bg-gray-50">
          <div className="text-black text-center max-w-sm">
            <h1 className="text-xl font-bold leading-tight">
              Get 4 Premium T-Shirts <br /> at ₹999 only
            </h1>
            <p className="text-sm mt-1 font-medium">
              Unmatched style & comfort — grab the{" "}
              <span className="font-semibold">Combo Offer</span> now!
            </p>
          </div>
        </div>
        <div className="sm:hidden absolute bottom-28 left-0 right-0 z-20 flex justify-center bg-gray-200 p-3">
          <Link
            to={{ pathname: "/collection", search: "?category=Combo" }}
            className="inline-block bg-black text-white hover:bg-gray-800 transition px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            Start Buying
          </Link>
        </div>

        {/* Large Screen Content */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-20 px-4">
          <div className="text-white text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Get 4 Premium T-Shirts <br /> at ₹999 only
            </h1>
            <p className="text-lg md:text-2xl font-semibold mb-6">
              Unique style & comfort — grab the{" "}
              <span className="font-semibold">Combo Offer</span> now!
            </p>
            <Link
              to={{ pathname: "/collection", search: "?category=Combo" }}
              className="inline-block bg-white hover:bg-gray-300 transition text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-semibold shadow-md"
            >
              Start Buying
            </Link>
          </div>
        </div>
      </section>

{/* Banner 3: Slideshow Section */}
      <section className="relative overflow-hidden mt-6 sm:mt-8 rounded-lg z-10 h-[65vh] sm:h-[80vh] md:h-[90vh] bg-white sm:bg-transparent">
        {/* Slideshow Images */}
        {slideData.map((slide, index) => (
          <div key={index} className="absolute inset-0">
            {!slide.imageLoaded && index === currentSlide && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
            )}
            <img
              src={slide.image}
              alt={slide.title}
              onLoad={() => slide.setImageLoaded(true)}
              className={`w-full h-full absolute inset-0 transition-all duration-1000 ${
                index === currentSlide && slide.imageLoaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              } object-contain sm:object-cover rounded-lg`}
            />
          </div>
        ))}
        
        <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slideData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Small Screen Content */}
        <div className="sm:hidden absolute top-9 left-0 p-3 right-0 z-20 flex justify-center bg-gray-50">
          <div className="text-black text-center max-w-sm">
            <h1 className="text-xl font-bold leading-tight transition-all duration-500">
              {slideData[currentSlide].title} <br /> {slideData[currentSlide].subtitle}
            </h1>
            <p className="text-sm mt-1 font-medium transition-all duration-500">
              {slideData[currentSlide].description}{" "}
              <span className="font-semibold">{slideData[currentSlide].highlight}</span>!
            </p>
          </div>
        </div>
        <div className="sm:hidden absolute bottom-20 left-0 right-0 z-20 flex justify-center bg-gray-200 p-3">
          <Link
            to={{ pathname: "/collection", search: "?category=Combo" }}
            className="inline-block bg-black text-white hover:bg-gray-800 transition px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            {slideData[currentSlide].buttonText}
          </Link>
        </div>

        {/* Large Screen Content */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-20 px-4">
          <div className="text-white text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 transition-all duration-500">
              {slideData[currentSlide].title} <br /> {slideData[currentSlide].subtitle}
            </h1>
            <p className="text-lg md:text-2xl font-semibold mb-6 transition-all duration-500">
              {slideData[currentSlide].description}{" "}
              <span className="font-semibold">{slideData[currentSlide].highlight}</span>!
            </p>
            <Link
              to={{ pathname: "/collection", search: "?category=Combo" }}
              className="inline-block bg-white hover:bg-gray-300 transition text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-semibold shadow-md"
            >
              {slideData[currentSlide].buttonText}
            </Link>
          </div>
        </div>
      </section>


      {/* Banner 2: Pick Any 4 at ₹899 */}
      <section className="relative overflow-hidden mt-6 sm:mt-8 rounded-lg z-10 h-[65vh] sm:h-[80vh] md:h-[90vh] bg-white sm:bg-transparent">
        {!imageLoaded2 && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />}
        <img
          src={Hero2}
          alt="Pick Any 4 Banner"
          onLoad={() => setImageLoaded2(true)}
          className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${
            imageLoaded2 ? "opacity-100" : "opacity-0"
          } object-contain sm:object-cover rounded-lg`}
        />
        <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Small Screen Content */}
        <div className="sm:hidden absolute top-9 left-0 p-3 right-0 z-20 flex justify-center bg-gray-50">
          <div className="text-black text-center max-w-sm">
            <h1 className="text-xl font-bold leading-tight">
              Pick Any 4 T-Shirts <br /> at ₹999 Only
            </h1>
            <p className="text-sm mt-1 font-medium">
              Stylish comfort in combos — build your own{" "}
              <span className="font-semibold">Pick 4</span> set now!
            </p>
          </div>
        </div>
        <div className="sm:hidden absolute bottom-20 left-0 right-0 z-20 flex justify-center bg-gray-200 p-3">
          <Link
            to={{ pathname: "/collection",  search: "?category=Combo"  }}
            className="inline-block bg-black text-white hover:bg-gray-800 transition px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            Start Picking
          </Link>
        </div>

        {/* Large Screen Content */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-20 px-4">
          <div className="text-white text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Pick Any 4 T-Shirts <br /> at ₹999 Only
            </h1>
            <p className="text-lg md:text-2xl font-semibold mb-6">
              Stylish comfort in combos — build your own{" "}
              <span className="font-semibold">Pick 4</span> set now!
            </p>
            <Link
              to={{ pathname: "/collection",  search: "?category=Combo"  }}
              className="inline-block bg-white hover:bg-gray-300 transition text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-semibold shadow-md"
            >
              Start Picking
            </Link>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Hero;
