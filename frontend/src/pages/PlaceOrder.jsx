import React, { useContext, useState, useEffect, useCallback } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

// List of Indian states
const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
];

const PlaceOrder = () => {
    const [method, setMethod] = useState('razorpay'); // default to razorpay
    const { navigate, backendUrl, token, cartItems, setCartItems, products, calculateCartTotals, currency } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'India',
        phone: ''
    })
    const [isLoading, setIsLoading] = useState(true);
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [buyNowData, setBuyNowData] = useState(null);
    const [cartSummary, setCartSummary] = useState({
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        discountApplied: false,
        discountMessage: ''
    });
    const [shippingFee, setShippingFee] = useState(0);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Check if it's guest checkout
        const guestCheckout = localStorage.getItem('isGuestCheckout') === 'true';
        setIsGuestCheckout(guestCheckout);
        
        if (guestCheckout) {
            // Get buy now data from localStorage
            const storedBuyNowData = localStorage.getItem('buyNowData');
            if (storedBuyNowData) {
                const data = JSON.parse(storedBuyNowData);
                setBuyNowData(data);
                
                // Calculate summary for guest checkout
                const product = products.find(p => p._id === data.productId);
                if (product) {
                    let subtotal = 0;
                    if (data.combo7Data) {
                        // Combo7 pricing
                        subtotal = 899; // Pick Any 4 at 899
                    } else {
                        subtotal = product.price * (data.quantity || 1);
                    }
                    setCartSummary({
                        subtotal,
                        discountAmount: 0,
                        total: subtotal,
                        discountApplied: false,
                        discountMessage: ''
                    });
                }
            } else {
                toast.error('No product selected for Buy Now');
                navigate('/');
                return;
            }
        } else {
            // Regular checkout - check if logged in
            if (!token) {
                toast.error('Please login to place an order');
                navigate('/login');
                return;
            }
        }
        
        // Set loading to false after a short delay to ensure smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [navigate, products, token]);

    useEffect(() => {
        if (!isGuestCheckout) {
            setCartSummary(calculateCartTotals());
        }
    }, [cartItems, products, calculateCartTotals, isGuestCheckout]);

    // Calculate shipping fee based on state
 // Calculate shipping fee (₹100 for all states)
useEffect(() => {
    if (formData.state) {
        setShippingFee(100);
    }
}, [formData.state]);


    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        // If country is being changed, validate it's India
        if (name === 'country' && value.toLowerCase() !== 'india') {
            toast.error('Sorry, we only deliver within India');
            return;
        }
        
        setFormData(data => ({ ...data, [name]: value }));
    }

    const initPay = (order, isGuest = false) => {
        const options = {
            key: 'rzp_live_YzPG4x7vsi9pK0',
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const verifyEndpoint = isGuest 
                        ? '/api/order/guest/verifyRazorpay'
                        : '/api/order/verifyRazorpay';
                    
                    const headers = isGuest ? {} : { headers: { token } };
                    const { data } = await axios.post(backendUrl + verifyEndpoint, { razorpay_order_id: response.razorpay_order_id }, headers);
                    
                    if (data.success) {
                        if (!isGuest) {
                            setCartItems({});
                        } else {
                            // Clear guest checkout data
                            localStorage.removeItem('buyNowData');
                            localStorage.removeItem('isGuestCheckout');
                        }
                        window.dispatchEvent(new Event('orderPlaced'));
                        toast.success("Order Placed!");
                        
                        // Store order details for confirmation page
                        const orderDetails = {
                            orderId: response.razorpay_order_id,
                            amount: cartSummary.total + shippingFee,
                            paymentMethod: 'Razorpay',
                            isGuest
                        };
                        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
                        
                        navigate('/confirmation', { state: { order: orderDetails } })
                    } else {
                        toast.error("Payment verification failed");
                    }
                } catch (error) {
                    toast.error(error.message || "Payment verification failed");
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        // Validate country is India
        if (formData.country.toLowerCase() !== 'india') {
            toast.error('Sorry, we only deliver within India');
            return;
        }

        // Check if guest checkout or regular checkout
        if (isGuestCheckout) {
            // Guest checkout flow
            if (!buyNowData) {
                toast.error('No product selected for Buy Now');
                navigate('/');
                return;
            }

            try {
                let orderItems = [];
                const product = products.find(p => p._id === buyNowData.productId);
                
                if (!product) {
                    toast.error('Product not found');
                    return;
                }

                if (buyNowData.combo7Data) {
                    // Handle Combo7
                    buyNowData.combo7Data.forEach(comboItem => {
                        const itemInfo = structuredClone(product);
                        itemInfo.size = `${comboItem.size}-${comboItem.color}`;
                        itemInfo.quantity = 1;
                        orderItems.push(itemInfo);
                    });
                } else {
                    // Handle regular product
                    const itemInfo = structuredClone(product);
                    itemInfo.size = `${buyNowData.size}-${buyNowData.color}`;
                    itemInfo.quantity = buyNowData.quantity || 1;
                    orderItems.push(itemInfo);
                }

                let orderData = {
                    address: formData,
                    items: orderItems,
                    amount: (cartSummary.total + shippingFee),
                    paymentMethod: method
                }

                // Handle payment based on selected method
                if (method === 'razorpay') {
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/guest/razorpay', orderData);
                    if (responseRazorpay.data.success) {
                        window.dispatchEvent(new Event('orderPlaced'));
                        initPay(responseRazorpay.data.order, true);
                    } else {
                        toast.error(responseRazorpay.data.message || "Failed to initiate Razorpay order")
                    }
                } else if (method === 'cod') {
                    // Cash on Delivery - create order directly
                    const responseCOD = await axios.post(backendUrl + '/api/order/guest/cod', orderData);
                    if (responseCOD.data.success) {
                        // Clear guest checkout data
                        localStorage.removeItem('buyNowData');
                        localStorage.removeItem('isGuestCheckout');
                        window.dispatchEvent(new Event('orderPlaced'));
                        toast.success("Order Placed! You will pay cash on delivery.");
                        
                        // Store order details for confirmation page
                        const orderDetails = {
                            orderId: responseCOD.data.order?._id || 'N/A',
                            amount: cartSummary.total + shippingFee,
                            paymentMethod: 'Cash on Delivery',
                            isGuest: true
                        };
                        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
                        
                        navigate('/confirmation', { state: { order: orderDetails } })
                    } else {
                        toast.error(responseCOD.data.message || "Failed to place COD order")
                    }
                }
            } catch (error) {
                toast.error(error.message || "An error occurred while placing your order.")
            }
        } else {
            // Regular checkout flow (requires login)
            if (!token) {
                toast.error('Please login to place an order');
                navigate('/login');
                return;
            }

            if (Object.keys(cartItems).length === 0) {
                toast.error("Your cart is empty. Please add items before placing an order.");
                navigate('/cart');
                return;
            }

            try {
                let orderItems = []

                for (const items in cartItems) {
                    for (const item in cartItems[items]) {
                        if (cartItems[items][item] > 0) {
                            const itemInfo = structuredClone(products.find(product => product._id === items))
                            if (itemInfo) {
                                itemInfo.size = item
                                itemInfo.quantity = cartItems[items][item]
                                orderItems.push(itemInfo)
                            }
                        }
                    }
                }

                let orderData = {
                    address: formData,
                    items: orderItems,
                    amount: (cartSummary.total + shippingFee),
                    paymentMethod: method
                }

                // Handle payment based on selected method
                if (method === 'razorpay') {
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
                    if (responseRazorpay.data.success) {
                        window.dispatchEvent(new Event('orderPlaced'));
                        initPay(responseRazorpay.data.order, false)
                    } else {
                        toast.error(responseRazorpay.data.message || "Failed to initiate Razorpay order")
                    }
                } else if (method === 'cod') {
                    // Cash on Delivery - create order directly
                    const responseCOD = await axios.post(backendUrl + '/api/order/cod', orderData, { headers: { token } })
                    if (responseCOD.data.success) {
                        setCartItems({})
                        window.dispatchEvent(new Event('orderPlaced'));
                        toast.success("Order Placed! You will pay cash on delivery.");
                        
                        // Store order details for confirmation page
                        const isNewUser = localStorage.getItem('isNewUser') === 'true';
                        if (isNewUser) {
                            localStorage.removeItem('isNewUser');
                        }
                        const orderDetails = {
                            orderId: responseCOD.data.order?._id || 'N/A',
                            amount: cartSummary.total + shippingFee,
                            paymentMethod: 'Cash on Delivery',
                            isNewUser
                        };
                        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
                        
                        navigate('/confirmation', { state: { order: orderDetails } })
                    } else {
                        toast.error(responseCOD.data.message || "Failed to place COD order")
                    }
                }

            } catch (error) {
                toast.error(error.message || "An error occurred while placing your order.")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col mt-20 sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------- Left Side ---------------- */}
           <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

  <div className="font-bold text-xl sm:text-2xl my-3 px-4">
    <h2>Delivery Information</h2>
  </div>

  <div className='flex gap-3'>
    <input 
      required 
      onChange={onChangeHandler} 
      name='firstName' 
      value={formData.firstName} 
      className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
      type="text" 
      placeholder='First name' 
    />
    <input 
      required 
      onChange={onChangeHandler} 
      name='lastName' 
      value={formData.lastName} 
      className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
      type="text" 
      placeholder='Last name' 
    />
  </div>

  <input 
    required 
    onChange={onChangeHandler} 
    name='email' 
    value={formData.email} 
    className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
    type="email" 
    placeholder='Email address' 
  />

  <input 
    required 
    onChange={onChangeHandler} 
    name='street' 
    value={formData.street} 
    className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
    type="text" 
    placeholder='Street' 
  />

  <div className='flex gap-3'>
    <input 
      required 
      onChange={onChangeHandler} 
      name='city' 
      value={formData.city} 
      className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
      type="text" 
      placeholder='City' 
    />
    <select
      required
      onChange={onChangeHandler}
      name='state'
      value={formData.state}
      className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-white'
    >
      <option value="">Select State</option>
      {INDIAN_STATES.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  </div>

  <div className='flex gap-3'>
    <input 
      required 
      onChange={onChangeHandler} 
      name='zipcode' 
      value={formData.zipcode} 
      className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
      type="number" 
      placeholder='Zipcode' 
    />
    <input 
      required 
      onChange={onChangeHandler} 
      name='country' 
      value={formData.country} 
      className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-100' 
      type="text" 
      placeholder='Country (India only)' 
      readOnly
    />
  </div>

  <input 
    required 
    onChange={onChangeHandler} 
    name='phone' 
    value={formData.phone} 
    className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
    type="tel" 
    placeholder='Phone' 
    pattern="[0-9]{10}" 
    title="Enter 10-digit phone number"
  />
</div>


            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80 bg-white rounded-2xl shadow-sm p-6 sm:p-8'>
                    <h2 className="text-2xl font-bold mb-4">Cart Totals</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{currency}{cartSummary.subtotal.toFixed(2)}</span>
                        </div>
                        {cartSummary.discountApplied && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-{currency}{cartSummary.discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping Fee</span>
                            <span className="font-medium">{currency}{shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold">{currency}{(cartSummary.total + shippingFee).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-12'>
                  
                <div className="font-bold text-xl sm:text-2xl my-3 px-4">
                  <h2>Payment Method</h2>
               </div>
                    {/* Payment method options */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div 
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                            onClick={() => setMethod('razorpay')}
                        >
                            <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : 'bg-white'}`}></div>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay" />
                            <span className="text-sm">Online Payment</span>
                        </div>
                        <div 
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                            onClick={() => setMethod('cod')}
                        >
                            <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : 'bg-white'}`}></div>
                            <span className="text-sm font-medium">Cash on Delivery</span>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
