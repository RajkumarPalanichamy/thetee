import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { useNavigate } from 'react-router-dom';
import Women from '../assets/Women.png';
import Men from '../assets/Men.png';

const GenderCollection = () => {
  const { products } = useContext(ShopContext);
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Product Skeleton Loader Component
  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  useEffect(() => {
    const men = products.filter((item) => item.category === 'Men');
    const women = products.filter((item) => item.category === 'Women');
    setMenProducts(men.slice(0, 4));
    setWomenProducts(women.slice(0, 4));
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);

  const handleNavigation = (category) => {
    navigate(`/collection?category=${encodeURIComponent(category.charAt(0).toUpperCase() + category.slice(1))}`);
  };

  return (
    <div className="px-4 py-10">
      {/* Heading */}
     <h2 className="text-xl sm:text-3xl md:text-4xl text-center font-extrabold tracking-tight text-gray-900 mb-2  pl-4">
  <span className=" bg-clip-text ">
    Explore Our Collections
  </span>
</h2>
<p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-center mt-5 text-gray-600'>
  Please select a collection by gender to explore our latest styles.
</p>


      {/* Grid of collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
        {/* Women Collection */}
       {/* Women Collection */}
<div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
  <img
    src={Women}
    alt="Women Collection"
    className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] object-cover"
  />
  <button
    onClick={() => handleNavigation('women')}
    className="absolute inset-0 m-auto h-12 w-32 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition duration-300"
  >
    Women
  </button>
</div>

{/* Men Collection */}
<div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
  <img
    src={Men}
    alt="Men Collection"
    className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] object-cover"
  />
  <button
    onClick={() => handleNavigation('men')}
  className="absolute inset-0 m-auto h-12 w-32 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition duration-300"
  >
    Men
  </button>
</div>


       
      </div>


     
    </div>
  );
};

export default GenderCollection;
