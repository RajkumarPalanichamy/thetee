import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({category, currentProductId}) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            let productsCopy = products.slice();
            
            // Filter by category
            productsCopy = productsCopy.filter((item) => 
                item.category === category && item._id !== currentProductId
            );

            // If we have more than 5 products, randomly select 5
            if (productsCopy.length > 5) {
                const shuffled = productsCopy.sort(() => 0.5 - Math.random());
                productsCopy = shuffled.slice(0, 5);
            }

            setRelated(productsCopy);
        }
    }, [products, category, currentProductId]);

    if (!related.length) return null;

    return (
        <div className='my-24'>
           <div className="text-center py-4">
  <h1 className="text-xl sm:text-lg md:text-2xl lg:text-4xl font-semibold">
    Related Products
  </h1>
</div>


            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
                    <ProductItem 
                        key={item._id} 
                        id={item._id} 
                        name={item.name} 
                        price={item.price} 
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
