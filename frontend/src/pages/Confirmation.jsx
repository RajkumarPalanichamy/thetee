import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const Confirmation = () => {
    const { navigate } = useContext(ShopContext);
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Get order details from location state or localStorage
        const stateOrder = location.state?.order;
        const storedOrder = localStorage.getItem('lastOrder');
        
        if (stateOrder) {
            setOrderDetails(stateOrder);
        } else if (storedOrder) {
            setOrderDetails(JSON.parse(storedOrder));
            localStorage.removeItem('lastOrder');
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 mt-20 pt-10">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-5xl text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>

                    {orderDetails && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                            <div className="space-y-2 text-sm">
                                <p><strong>Order ID:</strong> {orderDetails.orderId || 'N/A'}</p>
                                <p><strong>Total Amount:</strong> ₹{orderDetails.amount?.toFixed(2) || 'N/A'}</p>
                                <p><strong>Payment Method:</strong> {orderDetails.paymentMethod || 'N/A'}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-gray-700">
                            {orderDetails?.isGuest ? (
                                <>
                                    We've sent a confirmation email to your registered email address.
                                    <span className="block mt-2 text-sm text-gray-600">
                                        Your order will be processed and shipped soon.
                                    </span>
                                </>
                            ) : (
                                <>
                                    We've sent a confirmation email to your registered email address.
                                    {orderDetails?.isNewUser && (
                                        <span className="block mt-2 text-sm text-blue-600">
                                            Your account password has been sent to your email. Please check your inbox.
                                        </span>
                                    )}
                                </>
                            )}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!orderDetails?.isGuest && (
                                <button
                                    onClick={() => navigate('/orders')}
                                    className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors duration-200"
                                >
                                    View Orders
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;

