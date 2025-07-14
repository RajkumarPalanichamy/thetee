import React, { useContext, useEffect, useState, lazy, Suspense } from 'react';
import { ShopContext } from '../context/ShopContext';

// Lazy load the ProductItem component
const ProductItem = lazy(() => import('./ProductItem'));

const NewArrival = () => {
  const { products } = useContext(ShopContext);
  const [newArrival, setNewArrival] = useState([]);

  useEffect(() => {
    const newProducts = products.filter((item) => item.new);
    setNewArrival(newProducts.slice(0, 5)); // Adjust count as needed
  }, [products]);

 return (
  <section className="px-4 md:px-12 lg:px-20 py-20">
    <div className="text-center mb-12">
      <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
        New Arrivals
      </h1>
      <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
        Be the first to discover our latest styles and trends. Fresh designs, new colors, and innovative styles just arrived.
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
      <Suspense fallback={<div className="col-span-full text-center text-sm text-gray-500">Loading products...</div>}>
        {newArrival.map((item) => (
          <article key={item._id} className="product-item">
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          </article>
        ))}
      </Suspense>
    </div>
  </section>
);

};

export default NewArrival;
