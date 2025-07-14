import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import ReplacementForm from '../components/ReplacementForm';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaExchangeAlt } from 'react-icons/fa';

const Orders = () => {

  const { backendUrl, token , currency, products } = useContext(ShopContext);

  const [orderData,setorderData] = useState([])
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  const handleReplacementRequest = (item) => {
    setSelectedOrderItem(item);
    setIsReplacementModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'processing':
        return <FaBox className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-orange-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  // Group Combo7 items by order and product
  const groupedOrders = [];
  const combo7Map = {};
  orderData.forEach(item => {
    const productData = products.find(product => product._id === item._id);
    if (productData && productData.category === 'Combo7') {
      // Use a unique key for each Combo7 order (e.g., order date + product id)
      const key = `${item.date}-${item._id}`;
      if (!combo7Map[key]) {
        combo7Map[key] = {
          ...item,
          selections: []
        };
        groupedOrders.push(combo7Map[key]);
      }
      combo7Map[key].selections.push({
        color: item.color,
        size: item.size,
        quantity: item.quantity
      });
    } else {
      groupedOrders.push(item);
    }
  });

  return (
    <div className='border-t pt-16 bg-gray-50 min-h-screen mt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-2xl mb-8'>
         
               <div className="font-bold text-xl sm:text-2xl my-3 px-4">
  <h2>My Orders</h2>
</div>
        </div>

        <div className='space-y-6'>
          {groupedOrders.map((item, index) => {
            const productData = products.find(product => product._id === item._id);
            let displayedImage = '';
            if (productData) {
              // For Combo7, use main image; for others, use color image or fallback
              if (productData.category === 'Combo7') {
                displayedImage = productData.image[0];
              } else {
                const colorImage = productData.colors.find(colorOption => colorOption.name === item.color)?.images[0];
                displayedImage = colorImage || productData.image[0];
              }
            }
            // Combo7 grouped display
            if (productData && productData.category === 'Combo7' && item.selections) {
              return (
                <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                  <div className='p-6'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                      <div className='flex items-start gap-6'>
                        <div className='relative'>
                          <img 
                            className='w-24 h-24 object-cover rounded-lg shadow-sm' 
                            src={displayedImage} 
                            alt={item.name} 
                          />
                          <div className='absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md'>
                            {getStatusIcon(item.status)}
                          </div>
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold text-gray-800 mb-2'>{item.name} </h3>
                          <div className='text-sm text-gray-600 mb-2'>Pick Any 4 T-shirts at ₹899</div>
                          <ul className='mb-2'>
                            {item.selections.map((sel, idx) => (
                              <li key={idx} className='mb-1'>
                                <span className='font-medium'>Color {idx + 1}:</span> <span>{sel.color}</span>, <span className='font-medium'>Size:</span> <span>{sel.size}</span>, <span className='font-medium'>Qty:</span> <span>{sel.quantity}</span>
                              </li>
                            ))}
                          </ul>
                          <div className='mt-4 text-sm text-gray-500'>
                            <p>Order Date: <span className='text-gray-700'>{new Date(item.date).toLocaleDateString()}</span></p>
                            <p>Payment Method: <span className='text-gray-700'>{item.paymentMethod}</span></p>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col items-end gap-4'>
                        <div className='flex items-center gap-2'>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                            item.status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                            item.status.toLowerCase() === 'shipped' ? 'bg-orange-100 text-orange-800' :
                            item.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className='flex gap-3'>
                          <button 
                            onClick={loadOrderData} 
                            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
                          >
                            Track Order
                          </button>
                          <button
                            onClick={() => handleReplacementRequest(item)}
                            className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center gap-2'
                          >
                            <FaExchangeAlt />
                            Request Replacement
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            // Default (non-Combo7) display
            return (
              <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                <div className='p-6'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                    <div className='flex items-start gap-6'>
                      <div className='relative'>
                        <img 
                          className='w-24 h-32 object-cover rounded-lg shadow-sm' 
                          src={displayedImage} 
                          alt={item.name} 
                        />
                        <div className='absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md'>
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>{item.name}</h3>
                        <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                          <div>
                            <p className='font-medium'>Price: <span className='text-gray-800'>{currency}{item.price}</span></p>
                            <p className='font-medium'>Quantity: <span className='text-gray-800'>{item.quantity}</span></p>
                          </div>
                          <div>
                            <p className='font-medium'>Size: <span className='text-gray-800'>{item.size}</span></p>
                            {item.color && (
                              <div className='flex items-center gap-2'>
                                <p className='font-medium'>Color: <span className='text-gray-800'>{item.color}</span></p>
                                <div 
                                  className='w-4 h-4 rounded-full border shadow-sm' 
                                  style={{ backgroundColor: item.color }}
                                  title={item.color}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='mt-4 text-sm text-gray-500'>
                          <p>Order Date: <span className='text-gray-700'>{new Date(item.date).toLocaleDateString()}</span></p>
                          <p>Payment Method: <span className='text-gray-700'>{item.paymentMethod}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-4'>
                      <div className='flex items-center gap-2'>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                          item.status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                          item.status.toLowerCase() === 'shipped' ? 'bg-orange-100 text-orange-800' :
                          item.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className='flex gap-3'>
                        <button 
                          onClick={loadOrderData} 
                          className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => handleReplacementRequest(item)}
                          className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center gap-2'
                        >
                          <FaExchangeAlt />
                          Request Replacement
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orderData.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No orders found</p>
          </div>
        )}

        <ReplacementForm
          isOpen={isReplacementModalOpen}
          onClose={() => setIsReplacementModalOpen(false)}
          orderItem={selectedOrderItem}
        />
      </div>
    </div>
  )
}

export default Orders
