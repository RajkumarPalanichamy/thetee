import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [paymentStats, setPaymentStats] = useState({ cod: 0, razorpay: 0, other: 0 })
  const [filterMethod, setFilterMethod] = useState('all')

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        const ordersData = response.data.orders.reverse()
        setAllOrders(ordersData)
        setOrders(ordersData)
        
        // Calculate payment method statistics
        const stats = ordersData.reduce((acc, order) => {
          const paymentMethod = order.paymentMethod?.toLowerCase();
          if (paymentMethod === 'cod') {
            acc.cod++
          } else if (paymentMethod === 'razorpay') {
            acc.razorpay++
          } else {
            acc.other++
          }
          return acc
        }, { cod: 0, razorpay: 0, other: 0 })
        setPaymentStats(stats)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  const filterOrders = (method) => {
    setFilterMethod(method)
    if (method === 'all') {
      setOrders(allOrders)
    } else {
      const filtered = allOrders.filter(order => order.paymentMethod?.toLowerCase() === method.toLowerCase())
      setOrders(filtered)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3 className='text-2xl font-bold mb-6'>Order Management</h3>
      
      {/* Payment Method Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-600 text-sm font-medium'>Cash on Delivery</p>
              <p className='text-2xl font-bold text-orange-800'>{paymentStats.cod}</p>
            </div>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
              <span className='text-orange-600 font-bold text-lg'>₹</span>
            </div>
          </div>
        </div>
        
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-600 text-sm font-medium'>Razorpay</p>
              <p className='text-2xl font-bold text-blue-800'>{paymentStats.razorpay}</p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-blue-600 font-bold text-lg'>💳</span>
            </div>
          </div>
        </div>
        
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>Other Methods</p>
              <p className='text-2xl font-bold text-gray-800'>{paymentStats.other}</p>
            </div>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
              <span className='text-gray-600 font-bold text-lg'>?</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div className='mb-6'>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => filterOrders('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterMethod === 'all' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Orders ({allOrders.length})
          </button>
          <button
            onClick={() => filterOrders('COD')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterMethod === 'COD' 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            COD ({paymentStats.cod})
          </button>
          <button
            onClick={() => filterOrders('Razorpay')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterMethod === 'Razorpay' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Razorpay ({paymentStats.razorpay})
          </button>
        </div>
      </div>
      
      <div>
        {orders.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-6xl mb-4'>📦</div>
            <h3 className='text-xl font-semibold text-gray-600 mb-2'>
              {filterMethod === 'all' ? 'No orders found' : `No ${filterMethod} orders found`}
            </h3>
            <p className='text-gray-500'>
              {filterMethod === 'all' 
                ? 'Orders will appear here once customers start placing them.' 
                : 'Try selecting a different payment method filter.'
              }
            </p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                    }
                    else {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <div className='mt-3'>
                  <span className='text-sm font-medium'>Payment Method: </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.paymentMethod?.toLowerCase() === 'cod' 
                      ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                      : order.paymentMethod?.toLowerCase() === 'razorpay'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {order.paymentMethod}
                  </span>
                </div>
                <p className='mt-2'>
                  <span className='text-sm font-medium'>Payment: </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.payment 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {order.payment ? 'Done' : 'Pending'}
                  </span>
                </p>
                <p className='mt-2 text-sm'>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders