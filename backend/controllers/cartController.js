import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        const { userId, itemId, size, color } = req.body

        // Check stock availability
        const product = await productModel.findById(itemId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const colorData = product.colors.find(c => c.name === color);
        if (!colorData) {
            return res.json({ success: false, message: "Color not found" });
        }

        const stock = colorData.stock.get(size);
        if (!stock || stock <= 0) {
            return res.json({ success: false, message: "Item out of stock" });
        }

        const userData = await userModel.findById(userId)

        // Add a check for userData being null
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = await userData.cartData;

        const key = `${size}-${color}`;

        // Check if adding this item would exceed stock
        const currentQuantity = cartData[itemId]?.[key] || 0;
        if (currentQuantity + 1 > stock) {
            return res.json({ success: false, message: "Not enough stock available" });
        }

        if (cartData[itemId]) {
            if (cartData[itemId][key]) {
                cartData[itemId][key] += 1
            }
            else {
                cartData[itemId][key] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][key] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        const { userId, itemId, size, color, quantity } = req.body

        // Check stock availability
        const product = await productModel.findById(itemId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const colorData = product.colors.find(c => c.name === color);
        if (!colorData) {
            return res.json({ success: false, message: "Color not found" });
        }

        const stock = colorData.stock.get(size);
        if (!stock || stock < quantity) {
            return res.json({ success: false, message: "Not enough stock available" });
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        const key = `${size}-${color}`;
        cartData[itemId][key] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {
    try {
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// delete a specific product from user cart
const deleteFromCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID missing" });
        }
        const { itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData || {};
        if (cartData[itemId]) {
            if (size) {
                // Remove specific size-color variant
                delete cartData[itemId][size];
                // If no more variants, remove the product key
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                // Remove the entire product from cart
                delete cartData[itemId];
            }
            await userModel.findByIdAndUpdate(userId, { cartData });
            return res.json({ success: true, message: "Product removed from cart" });
        }
        res.status(404).json({ success: false, message: "Product not found in cart" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// clear the entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.userId;
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart, deleteFromCart, clearCart }