import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const GuestCheckout = () => {
    const { backendUrl, setToken, navigate, addToCart, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [buyNowData, setBuyNowData] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Get buy now data from localStorage
        const storedData = localStorage.getItem('buyNowData');
        if (!storedData) {
            toast.error('No product selected for Buy Now');
            navigate('/');
            return;
        }
        setBuyNowData(JSON.parse(storedData));
    }, [navigate]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('Please enter your email');
            return;
        }

        setIsLoading(true);

        try {
            // Create account and auto-login
            const response = await axios.post(backendUrl + '/api/user/guest-checkout', {
                name: formData.name.trim(),
                email: formData.email.trim()
            });

            if (response.data.success) {
                // Set token and auto-login
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                
                // Store if it's a new user for confirmation page
                if (response.data.isNewUser) {
                    localStorage.setItem('isNewUser', 'true');
                }
                
                toast.success(response.data.message || 'Account created successfully!');

                // Add product to cart
                if (buyNowData) {
                    if (buyNowData.combo7Data) {
                        // Handle Combo7
                        await addToCart(buyNowData.productId, buyNowData.combo7Data, 'Combo7');
                    } else {
                        // Handle regular product
                        await addToCart(buyNowData.productId, buyNowData.size, buyNowData.color);
                    }
                    
                    // Clear buy now data
                    localStorage.removeItem('buyNowData');
                }

                // Small delay to ensure cart is updated
                setTimeout(() => {
                    navigate('/place-order');
                }, 500);
            } else {
                toast.error(response.data.message || 'Failed to create account');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Creating your account...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-20 pt-10">
            <div className="max-w-md mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Checkout</h1>
                    <p className="text-gray-600 mb-6">
                        Enter your details to proceed. We'll create an account for you automatically.
                    </p>

                    <form onSubmit={onSubmitHandler} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={onChangeHandler}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={onChangeHandler}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                We'll send your account password to this email
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Continue to Checkout'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestCheckout;

