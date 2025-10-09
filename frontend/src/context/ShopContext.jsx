import { createContext, useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 0;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountMessage, setDiscountMessage] = useState('');
    const navigate = useNavigate();
    const discountToastShownRef = useRef(false);

    const addToCart = async (itemId, size, color) => {
        // Combo7 special handling
        if (color === 'Combo7' && Array.isArray(size)) {
            let cartData = structuredClone(cartItems);
            let added = false;
            size.forEach((sel, idx) => {
                if (!sel.color || !sel.size) return;
                const key = `${sel.size}-${sel.color}`;
                if (cartData[itemId]) {
                    if (cartData[itemId][key]) {
                        cartData[itemId][key] += 1;
                    } else {
                        cartData[itemId][key] = 1;
                    }
                } else {
                    cartData[itemId] = {};
                    cartData[itemId][key] = 1;
                }
                added = true;
            });
            if (added) {
                setCartItems(cartData);
                toast.success('Combo7 selections added to cart!');
            } else {
                toast.error('Please select color and size for all Combo7 T-shirts.');
            }
            return;
        }

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        if (!color || typeof color !== 'string') {
            toast.error('Select Product Color');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][`${size}-${color}`]) {
                cartData[itemId][`${size}-${color}`] += 1;
            } else {
                cartData[itemId][`${size}-${color}`] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][`${size}-${color}`] = 1;
        }

        setCartItems(cartData);
        toast.success('Item added to cart!');

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size, color }, { headers: { token } });
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to add item to cart');
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    // Silent error
                }
            }
        }
        return totalCount;
    };

    // New function to count unique products (not quantities)
    const getCartItemCount = () => {
        let uniqueItemCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        uniqueItemCount += 1; // Count each unique size-color combination as 1 item
                    }
                } catch (error) {
                    // Silent error
                }
            }
        }
        return uniqueItemCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        const [itemSize, itemColor] = size.split('-');
        const product = products.find(p => p._id === itemId);

        if (!product) {
            toast.error('Product not found.');
            return;
        }

        const colorData = product.colors.find(c => c.name === itemColor);

        if (quantity === 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
                setCartItems(cartData);
            }

            if (token) {
                try {
                    await axios.post(backendUrl + '/api/cart/delete', { itemId, size }, { headers: { token } });
                    // Sync cartItems with backend after deletion
                    await getUserCart(token);
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to remove item from cart');
                }
            }
            return;
        }

        // Update local state immediately for better UX
        if (!colorData || !colorData.stock || colorData.stock[itemSize] === undefined) {
            cartData[itemId][size] = quantity;
            setCartItems(cartData);
        } else {
            const availableStock = colorData.stock[itemSize];

            if (quantity > availableStock) {
                toast.error(`Only ${availableStock} item(s) of ${product.name} (${itemColor}, ${itemSize}) available.`);
                return; // Don't update if stock exceeded
            } else {
                cartData[itemId][size] = quantity;
                setCartItems(cartData);
            }
        }

        // Update backend asynchronously without blocking UI
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                // Don't show error toast for quantity updates to avoid spam
                console.error('Failed to update cart:', error);
            }
        }
    };

    const calculateCartTotals = useCallback(() => {
        let currentSubtotal = 0;
        let combo7Count = 0;
        let combo7ProductIds = [];
        let combo7BasePrice = 0;

        for (const productId in cartItems) {
            const product = products.find(p => p._id === productId);
            if (product) {
                for (const sizeColorKey in cartItems[productId]) {
                    if (cartItems[productId][sizeColorKey] > 0) {
                        const itemPrice = product.price;
                        const itemQuantity = cartItems[productId][sizeColorKey];
                        if (product.category === 'Combo7') {
                            combo7Count += itemQuantity;
                            combo7ProductIds.push({ product, quantity: itemQuantity });
                            combo7BasePrice = itemPrice; // assumes all Combo7 have same price
                        } else {
                            currentSubtotal += itemPrice * itemQuantity;
                        }
                    }
                }
            }
        }

        // Apply Pick Any 4 at 899 offer
        if (combo7Count === 4) {
            currentSubtotal += 899;
        } else if (combo7Count > 0) {
            // Use base price for all Combo7 items if not exactly 4
            currentSubtotal += combo7Count * combo7BasePrice;
        }

        let discountAmount = 0;
        let discountApplied = combo7Count === 4;
        let discountMessage = discountApplied ? 'Pick Any 4 at ₹899 applied' : '';

        return {
            subtotal: currentSubtotal,
            discountAmount,
            total: currentSubtotal,
            discountApplied,
            discountMessage
        };
    }, [cartItems, products]);

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to load products');
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            toast.error('Failed to load cart');
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    useEffect(() => {
        calculateCartTotals();
    }, [cartItems, products, calculateCartTotals]);

    const clearCart = async () => {
        setCartItems({});
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/clear', {}, { headers: { token } });
                // Sync cartItems with backend after clearing
                await getUserCart(token);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to clear cart');
            }
        }
    };

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        getCartItemCount,
        updateQuantity,
        calculateCartTotals,
        navigate,
        backendUrl,
        setToken,
        token,
        discountApplied,
        discountMessage,
        clearCart
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
