import React, { useContext, useEffect, useState, lazy, Suspense } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

// Lazy load the ProductItem component
const ProductItem = lazy(() => import('./ProductItem'));

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5)); // Adjust count if needed
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4 pl-4">
          <span className="bg-clip-text">Best Sellers</span>
        </h2>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our best sellers — customer favorites that combine quality, style, and unbeatable value.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        <Suspense fallback={<div className="col-span-full text-center text-sm text-gray-500">Loading best sellers...</div>}>
          {bestSeller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default BestSeller;
