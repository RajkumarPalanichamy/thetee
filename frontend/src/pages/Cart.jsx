import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { FaTrash, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, setCartItems, calculateCartTotals, delivery_fee, clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    discountAmount: 0,
    total: 0,
    discountApplied: false,
    discountMessage: ''
  });

  // Debounced quantity update to prevent rapid API calls
  const debouncedUpdateQuantity = async (itemId, sizeColor, quantity) => {
    if (updatingQuantity) return; // Prevent multiple simultaneous updates
    
    setUpdatingQuantity(true);
    try {
      await updateQuantity(itemId, sizeColor, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      // Small delay to prevent rapid successive calls
      setTimeout(() => setUpdatingQuantity(false), 300);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Memoize cart data calculation to prevent unnecessary re-renders
  const memoizedCartData = useMemo(() => {
    if (products.length === 0) return [];
    
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const [size, color] = item.split('-');
          const product = products.find(p => p._id === items);
          if (product) {
            tempData.push({
              _id: items,
              size,
              color,
              quantity: cartItems[items][item]
            });
          }
        }
      }
    }
    return tempData;
  }, [cartItems, products]);

  // Memoize cart totals calculation
  const memoizedCartSummary = useMemo(() => {
    return calculateCartTotals();
  }, [calculateCartTotals]);

  useEffect(() => {
    if (products.length > 0) {
      setCartData(memoizedCartData);
      setCartSummary(memoizedCartSummary);
      setIsLoading(false);
    }
  }, [memoizedCartData, memoizedCartSummary, products.length]);

  useEffect(() => {
    // Hide success message after 3 seconds
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Shopping Cart</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review your items and proceed to checkout
          </p>
        </div>

        {cartData.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
              <div className="divide-y divide-gray-200">
                {cartData.map((item, index) => {
                  const productData = products.find(product => product._id === item._id);
                  if (!productData) return null;

                  // Combo7 custom display
                  if (productData.category === 'Combo7') {
                    // Find all cartData items for this product
                    const combo7Items = cartData.filter(cd => cd._id === item._id);
                    // Only render once per Combo7 product
                    if (combo7Items[0] !== item) return null;
                    return (
                      <div key={index} className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          {/* Image */}
                          <div className="w-full sm:w-40 h-56 sm:h-64 flex-shrink-0">
                            <img 
                              className="w-full h-full object-cover rounded-lg shadow-sm" 
                              src={productData.image[0]} 
                              alt={productData.name} 
                            />
                          </div>
                          {/* Product Details */}
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{productData.name}</h3>
                            <div className="text-sm text-gray-600 mb-2">Pick Any 4 T-shirts at ₹899</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {combo7Items.map((comboItem, idx) => (
                                <div key={idx} className="bg-gray-50 rounded p-2 border flex flex-col gap-1">
                                  <span>Color {idx + 1}: <span className="font-medium">{comboItem.color}</span></span>
                                  <span>Size {idx + 1}: <span className="font-medium">{comboItem.size}</span></span>
                                  <span>Qty: {comboItem.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const colorImage = productData.colors.find(colorOption => colorOption.name === item.color)?.images[0];
                  const displayedImage = colorImage || productData.image[0];

                  return (
                    <div key={index} className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Image */}
                        <div className="w-full sm:w-40 h-56 sm:h-64 flex-shrink-0">
                          <img 
                            className="w-full h-full object-cover rounded-lg shadow-sm" 
                            src={displayedImage} 
                            alt={productData.name} 
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{productData.name}</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Price:</span> {currency}{productData.price}
                            </div>
                            <div>
                              <span className="font-medium">Size:</span> {item.size}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Color:</span>
                              <span className="capitalize">{item.color}</span>
                              <span
                                className="w-4 h-4 inline-block rounded-full border"
                                style={{ backgroundColor: item.color }}
                                title={item.color}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              onClick={() => {
                                const newQuantity = Math.max(1, item.quantity - 1);
                                debouncedUpdateQuantity(item._id, `${item.size}-${item.color}`, newQuantity);
                              }}
                              disabled={updatingQuantity}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value > 0) debouncedUpdateQuantity(item._id, `${item.size}-${item.color}`, value);
                              }}
                              disabled={updatingQuantity}
                              className="w-16 text-center border-x py-2 focus:outline-none disabled:opacity-50"
                            />
                            <button
                              onClick={() => {
                                debouncedUpdateQuantity(item._id, `${item.size}-${item.color}`, item.quantity + 1);
                              }}
                              disabled={updatingQuantity}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingQuantity ? '...' : '+'}
                            </button>
                          </div>
                          <button
                            onClick={() => updateQuantity(item._id, `${item.size}-${item.color}`, 0)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Total and Buttons */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">Cart Totals</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{currency}{cartSummary.subtotal.toFixed(2)}</span>
                </div>
                {cartSummary.discountApplied && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({cartSummary.discountMessage})</span>
                      <span>-{currency}{cartSummary.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-green-600">
                      {cartSummary.discountMessage}
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium">{currency}{delivery_fee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">{currency}{(cartSummary.total + delivery_fee).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-300 font-medium"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => {
                    if (!localStorage.getItem('token')) {
                      toast.error('Please log in to place your order.');
                      return;
                    }
                    navigate('/place-order');
                  }}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
