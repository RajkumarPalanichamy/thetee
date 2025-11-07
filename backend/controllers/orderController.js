import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import productModel from "../models/productModel.js"

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Razorpay only if credentials are available
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.log('Razorpay credentials not found. Razorpay payments will be disabled.');
}

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address, paymentMethod } = req.body;

        // Update stock for each item
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.json({ success: false, message: `Product ${item._id} not found` });
            }

            const colorData = product.colors.find(c => c.name === item.color);
            if (!colorData) {
                return res.json({ success: false, message: `Color ${item.color} not found for product ${item._id}` });
            }

            const currentStock = colorData.stock.get(item.size);
            if (!currentStock || currentStock < item.quantity) {
                return res.json({ success: false, message: `Not enough stock for ${item.name} in size ${item.size} and color ${item.color}` });
            }

            // Update stock using findOneAndUpdate with $inc
            const updateResult = await productModel.findOneAndUpdate(
                { _id: item._id, "colors.name": item.color },
                { $inc: { [`colors.$.stock.${item.size}`]: -item.quantity } },
                { new: true, runValidators: true }
            );

            if (!updateResult) {
                 // This case should ideally not happen if the above checks pass, but as a fallback
                console.error(`Failed to update stock for product ${item._id}`);
                return res.json({ success: false, message: `Failed to update stock for product ${item.name}` });
            }
        }

        // Fetch and log the updated product data after stock reduction (for verification)
        const updatedProduct = await productModel.findById(items[0]._id).lean();
        console.log('Backend: Product stock after COD order:', updatedProduct.colors.map(color => ({ name: color.name, stock: color.stock instanceof Map ? Object.fromEntries(color.stock) : color.stock })));

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "COD",
            date: Date.now()
        }

        const order = new orderModel(orderData)
        await order.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address, paymentMethod} = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            // Get the order details
            const order = await orderModel.findByIdAndUpdate(orderId, {payment:true});

            if (order) {
                // Reduce stock for each item in the order
                for (const item of order.items) {
                    const product = await productModel.findById(item._id);
                    if (product) {
                        const colorData = product.colors.find(c => c.name === item.color);
                        if (colorData) {
                            const currentStock = colorData.stock.get(item.size);
                            if (currentStock !== undefined) { // Check if stock exists for this size
                                // Update stock using findOneAndUpdate with $inc
                                const updateResult = await productModel.findOneAndUpdate(
                                    { _id: item._id, "colors.name": item.color },
                                    { $inc: { [`colors.$.stock.${item.size}`]: -item.quantity } },
                                    { new: true, runValidators: true }
                                );

                                if (!updateResult) {
                                     console.error(`Failed to update stock for product ${item._id} in verifyStripe`);
                                    // Depending on requirements, you might want to handle this error more aggressively
                                }
                            }
                        }
                    }
                }
                // Fetch and log the updated product data after stock reduction (for verification)
                const updatedProduct = await productModel.findById(order.items[0]._id).lean();
                console.log('Backend: Product stock after Stripe order:', updatedProduct.colors.map(color => ({ name: color.name, stock: color.stock instanceof Map ? Object.fromEntries(color.stock) : color.stock })));
            }

            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpayInstance) {
            return res.json({ success: false, message: "Razorpay is not configured. Please contact administrator." });
        }
        
        const { userId, items, amount, address, paymentMethod} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpayInstance) {
            return res.json({ success: false, message: "Razorpay is not configured. Please contact administrator." });
        }

        const { userId, razorpay_order_id  } = req.body
        console.log('Verify Razorpay: Received orderId:', razorpay_order_id);

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            // Get the order details using the receipt (which is the order ID)
            const order = await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});

            if (order) {
                console.log('Verify Razorpay: Found order and updated payment status:', order._id);
                console.log('Verify Razorpay: Items in order:', order.items);
                // Reduce stock for each item in the order
                for (const item of order.items) {
                    console.log('Verify Razorpay: Processing item:', item);
                    const product = await productModel.findById(item._id);
                    if (product) {
                        // Parse size and color from the combined format (e.g., "S-black")
                        const [size, color] = item.size.split('-');
                        console.log('Parsed size:', size, 'color:', color);
                        
                        const colorData = product.colors.find(c => c.name === color);
                        if (colorData) {
                            const currentStock = colorData.stock.get(size);
                            if (currentStock !== undefined) { // Check if stock exists for this size
                                console.log(`Current stock for ${size}-${color}:`, currentStock);
                                console.log(`Attempting to update stock for product ${item._id}, color ${color}, size ${size}, quantity ${item.quantity}`);
                                
                                // Reduce stock using findOneAndUpdate with $inc
                                const updateResult = await productModel.findOneAndUpdate(
                                    { _id: item._id, "colors.name": color },
                                    { $inc: { [`colors.$.stock.${size}`]: -item.quantity } },
                                    { new: true, runValidators: true }
                                );

                                console.log('findOneAndUpdate result:', updateResult);

                                if (!updateResult) {
                                    console.error(`Failed to update stock for product ${item._id} in verifyRazorpay`);
                                }
                            } else {
                                console.error(`No stock found for size ${size} and color ${color}`);
                            }
                        } else {
                            console.error(`Color ${color} not found in product ${item._id}`);
                        }
                    }
                }
                // Fetch and log the updated product data after stock reduction (for verification)
                const updatedProduct = await productModel.findById(order.items[0]._id).lean();
                console.log('Backend: Product stock after Razorpay order:', updatedProduct.colors.map(color => ({ name: color.name, stock: color.stock instanceof Map ? Object.fromEntries(color.stock) : color.stock })));
            } else {
                console.log('Verify Razorpay: Order not found for receipt:', orderInfo.receipt);
            }

            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({ success: true, message: "Payment Successful" })
        } else {
            console.log('Verify Razorpay: Payment not successful for order:', razorpay_order_id);
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// delete order from Admin Panel
const deleteOrder = async (req,res) => {
    try {
        
        const { orderId } = req.body

        const order = await orderModel.findByIdAndDelete(orderId)
        if (!order) {
            return res.json({success:false,message:'Order not found'})
        }
        res.json({success:true,message:'Order Deleted Successfully'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Cash on Delivery endpoint
const placeOrderCOD = async (req, res) => {
    try {
        const { address, items, amount, paymentMethod, userId } = req.body;

        // Update stock for each item
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.json({ success: false, message: `Product ${item._id} not found` });
            }

            // Parse size and color from the combined format (e.g., "S-black")
            const [size, color] = item.size.split('-');
            const colorData = product.colors.find(c => c.name === color);
            if (!colorData) {
                return res.json({ success: false, message: `Color ${color} not found for product ${item._id}` });
            }

            const currentStock = colorData.stock.get(size);
            if (!currentStock || currentStock < item.quantity) {
                return res.json({ success: false, message: `Not enough stock for ${item.name} in size ${size} and color ${color}` });
            }

            // Update stock using findOneAndUpdate with $inc
            const updateResult = await productModel.findOneAndUpdate(
                { _id: item._id, "colors.name": color },
                { $inc: { [`colors.$.stock.${size}`]: -item.quantity } },
                { new: true, runValidators: true }
            );

            if (!updateResult) {
                console.error(`Failed to update stock for product ${item._id}`);
                return res.json({ success: false, message: `Failed to update stock for product ${item.name}` });
            }
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "COD",
            payment: true, // COD is considered paid when order is placed
            date: Date.now()
        }

        const order = new orderModel(orderData)
        await order.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "COD Order Placed Successfully", order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Guest Order - Razorpay (no auth required)
const placeGuestOrderRazorpay = async (req, res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpayInstance) {
            return res.json({ success: false, message: "Razorpay is not configured. Please contact administrator." });
        }
        
        const { items, amount, address, paymentMethod } = req.body;

        const orderData = {
            userId: "guest",
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "Razorpay",
            payment: false,
            date: Date.now(),
            isGuest: true
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Guest Order - Verify Razorpay (no auth required)
const verifyGuestRazorpay = async (req, res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpayInstance) {
            return res.json({ success: false, message: "Razorpay is not configured. Please contact administrator." });
        }

        const { razorpay_order_id } = req.body
        console.log('Verify Guest Razorpay: Received orderId:', razorpay_order_id);

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            // Get the order details using the receipt (which is the order ID)
            const order = await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });

            if (order) {
                console.log('Verify Guest Razorpay: Found order and updated payment status:', order._id);
                console.log('Verify Guest Razorpay: Items in order:', order.items);
                // Reduce stock for each item in the order
                for (const item of order.items) {
                    console.log('Verify Guest Razorpay: Processing item:', item);
                    const product = await productModel.findById(item._id);
                    if (product) {
                        // Handle both formats: separate size/color or combined "size-color"
                        let size, color;
                        if (item.size && item.color) {
                            // Separate fields
                            size = item.size;
                            color = item.color;
                        } else if (item.size && item.size.includes('-')) {
                            // Combined format (e.g., "S-black")
                            [size, color] = item.size.split('-');
                        } else {
                            console.error(`Invalid item format for product ${item._id}`);
                            continue;
                        }
                        
                        console.log('Parsed size:', size, 'color:', color);
                        
                        const colorData = product.colors.find(c => c.name === color);
                        if (colorData) {
                            const currentStock = colorData.stock.get(size);
                            if (currentStock !== undefined) {
                                console.log(`Current stock for ${size}-${color}:`, currentStock);
                                console.log(`Attempting to update stock for product ${item._id}, color ${color}, size ${size}, quantity ${item.quantity}`);
                                
                                // Reduce stock using findOneAndUpdate with $inc
                                const updateResult = await productModel.findOneAndUpdate(
                                    { _id: item._id, "colors.name": color },
                                    { $inc: { [`colors.$.stock.${size}`]: -item.quantity } },
                                    { new: true, runValidators: true }
                                );

                                console.log('findOneAndUpdate result:', updateResult);

                                if (!updateResult) {
                                    console.error(`Failed to update stock for product ${item._id} in verifyGuestRazorpay`);
                                }
                            } else {
                                console.error(`No stock found for size ${size} and color ${color}`);
                            }
                        } else {
                            console.error(`Color ${color} not found in product ${item._id}`);
                        }
                    }
                }
                // Fetch and log the updated product data after stock reduction (for verification)
                const updatedProduct = await productModel.findById(order.items[0]._id).lean();
                console.log('Backend: Product stock after Guest Razorpay order:', updatedProduct.colors.map(color => ({ name: color.name, stock: color.stock instanceof Map ? Object.fromEntries(color.stock) : color.stock })));
            } else {
                console.log('Verify Guest Razorpay: Order not found for receipt:', orderInfo.receipt);
            }

            // Don't update user cart for guest orders
            res.json({ success: true, message: "Payment Successful" })
        } else {
            console.log('Verify Guest Razorpay: Payment not successful for order:', razorpay_order_id);
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Guest Order - COD (no auth required)
const placeGuestOrderCOD = async (req, res) => {
    try {
        const { address, items, amount, paymentMethod } = req.body;

        // Update stock for each item
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.json({ success: false, message: `Product ${item._id} not found` });
            }

            // Handle both formats: separate size/color or combined "size-color"
            let size, color;
            if (item.size && item.color) {
                // Separate fields
                size = item.size;
                color = item.color;
            } else if (item.size && item.size.includes('-')) {
                // Combined format (e.g., "S-black")
                [size, color] = item.size.split('-');
            } else {
                return res.json({ success: false, message: `Invalid item format for product ${item._id}` });
            }

            const colorData = product.colors.find(c => c.name === color);
            if (!colorData) {
                return res.json({ success: false, message: `Color ${color} not found for product ${item._id}` });
            }

            const currentStock = colorData.stock.get(size);
            if (!currentStock || currentStock < item.quantity) {
                return res.json({ success: false, message: `Not enough stock for ${item.name} in size ${size} and color ${color}` });
            }

            // Update stock using findOneAndUpdate with $inc
            const updateResult = await productModel.findOneAndUpdate(
                { _id: item._id, "colors.name": color },
                { $inc: { [`colors.$.stock.${size}`]: -item.quantity } },
                { new: true, runValidators: true }
            );

            if (!updateResult) {
                console.error(`Failed to update stock for product ${item._id}`);
                return res.json({ success: false, message: `Failed to update stock for product ${item.name}` });
            }
        }

        const orderData = {
            userId: "guest",
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "COD",
            payment: true, // COD is considered paid when order is placed
            date: Date.now(),
            isGuest: true
        }

        const order = new orderModel(orderData)
        await order.save()

        // Don't update user cart for guest orders

        res.json({ success: true, message: "Guest COD Order Placed Successfully", order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, placeOrderCOD, placeGuestOrderRazorpay, placeGuestOrderCOD, verifyGuestRazorpay, allOrders, userOrders, updateStatus, deleteOrder}