import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller, colors, type } = req.body;

        const uploadedFiles = req.files; // Files are now in req.files array with upload.any()

        // Separate color-specific images
        const colorImagesFiles = {}; // { colorName: [file1, file2, file3, file4] }

        uploadedFiles.forEach(file => {
             const parts = file.fieldname.split('_image_');
             if (parts.length === 2) {
                 const color = parts[0];
                 const index = parseInt(parts[1]);
                 if (!colorImagesFiles[color]) {
                     colorImagesFiles[color] = [null, null, null, null];
                 }
                 colorImagesFiles[color][index] = file;
             }
        });

        // Upload color-specific images to Cloudinary and prepare color data with stock
        const colorsWithImages = await Promise.all(JSON.parse(colors).map(async (color) => {
            const colorName = color.name;
            const images = colorImagesFiles[colorName] || [];
            
            let colorImagesUrls = await Promise.all(
                images.filter(file => file !== null).map(async (file) => {
                    let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );

            // Create stock map for this color with default sizes
            const stockMap = new Map();
            DEFAULT_SIZES.forEach(size => {
                stockMap.set(size, color.stock?.[size] || 0);
            });

            return { 
                name: colorName, 
                value: color.value,
                images: colorImagesUrls,
                stock: stockMap
            };
        }));

        // Determine main images from the first color's images
        const mainImagesUrls = colorsWithImages.length > 0 && colorsWithImages[0].images.length > 0
            ? colorsWithImages[0].images
            : []; // Fallback to empty array if no colors or images

        // Generate a simple unique SKU based on timestamp
        const sku = `SKU-${Date.now()}`;

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: DEFAULT_SIZES,
            colors: colorsWithImages,
            image: mainImagesUrls, // Storing the first color's images as main images
            date: Date.now(),
            sku,
            type
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId).lean()

        // Ensure the 'type' field is included in the returned product data
        if (!product.type) {
            // You might want to set a default type or handle this case as needed
            product.type = ''; 
        }

        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update product stock
const updateStock = async (req, res) => {
    try {
        const { productId, color, size, quantity } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const colorData = product.colors.find(c => c.name === color);
        if (!colorData) {
            return res.json({ success: false, message: "Color not found" });
        }

        // Update stock for the specific size
        colorData.stock.set(size, quantity);
        await product.save();

        res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get total available quantity for a product
const getTotalQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        let totalQuantity = 0;
        product.colors.forEach(color => {
            color.stock.forEach((quantity) => {
                totalQuantity += quantity;
            });
        });

        res.json({ success: true, totalQuantity });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update stock after purchase
const updateStockAfterPurchase = async (req, res) => {
    try {
        const { productId, color, size, quantity } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const colorData = product.colors.find(c => c.name === color);
        if (!colorData) {
            return res.json({ success: false, message: "Color not found" });
        }

        const currentStock = colorData.stock.get(size) || 0;
        if (currentStock < quantity) {
            return res.json({ success: false, message: "Insufficient stock" });
        }

        // Update stock by reducing the purchased quantity
        colorData.stock.set(size, currentStock - quantity);
        await product.save();

        res.json({ success: true, message: "Stock updated successfully after purchase" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add a new color to an existing product
const addColorToProduct = async (req, res) => {
    try {
        const { productId, name, value, stock } = req.body;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Handle color images upload
        const uploadedFiles = req.files || [];
        let colorImagesUrls = await Promise.all(
            uploadedFiles.map(async (file) => {
                let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // Prepare stock map
        const stockMap = new Map();
        if (stock) {
            const stockObj = typeof stock === 'string' ? JSON.parse(stock) : stock;
            Object.entries(stockObj).forEach(([size, quantity]) => {
                stockMap.set(size, quantity);
            });
        }

        // Add new color to product
        product.colors.push({
            name,
            value,
            images: colorImagesUrls,
            stock: stockMap
        });
        await product.save();
        res.json({ success: true, message: "Color added to product" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update product details (e.g., price, name, description, images)
const updateProduct = async (req, res) => {
    try {
        const { productId, price, name, description, category, subCategory, bestseller, type, sizes, colors } = req.body;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Handle image uploads if provided
        const uploadedFiles = req.files || [];
        let newImageUrls = [];
        // Separate color-specific images
        const colorImagesFiles = {}; // { colorName: [file1, file2, file3, file4] }
        uploadedFiles.forEach(file => {
            const parts = file.fieldname.split('_image_');
            if (parts.length === 2) {
                const color = parts[0];
                const index = parseInt(parts[1]);
                if (!colorImagesFiles[color]) {
                    colorImagesFiles[color] = [null, null, null, null];
                }
                colorImagesFiles[color][index] = file;
            } else {
                // Main product images (fieldname === 'images')
                if (file.fieldname === 'images') {
                    newImageUrls.push(file);
                }
            }
        });

        // Update fields
        if (price !== undefined) product.price = price;
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (category !== undefined) product.category = category;
        if (subCategory !== undefined) product.subCategory = subCategory;
        if (bestseller !== undefined) product.bestseller = bestseller;
        if (type !== undefined) product.type = type;

        // Update main images if new images were uploaded
        if (newImageUrls.length > 0) {
            const uploadedMainImages = await Promise.all(
                newImageUrls.map(async (file) => {
                    let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
            product.image = uploadedMainImages;
        }

        // Update sizes and colors if provided
        if (sizes) {
            product.sizes = JSON.parse(sizes);
        }
        if (colors) {
            // Parse colors and update with images/stock
            const parsedColors = JSON.parse(colors);
            const colorsWithImages = await Promise.all(parsedColors.map(async (color) => {
                const colorName = color.name;
                const images = colorImagesFiles[colorName] || [];
                let colorImagesUrls = await Promise.all(
                    images.filter(file => file !== null).map(async (file) => {
                        let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                        return result.secure_url;
                    })
                );
                // If no new images uploaded, keep existing images if present
                if (colorImagesUrls.length === 0) {
                    const existingColor = product.colors.find(c => c.name === colorName);
                    colorImagesUrls = existingColor ? existingColor.images : [];
                }
                // Create stock map for this color
                const stockMap = new Map();
                product.sizes.forEach(size => {
                    stockMap.set(size, color.stock?.[size] || 0);
                });
                return {
                    name: colorName,
                    value: color.value,
                    images: colorImagesUrls,
                    stock: stockMap
                };
            }));
            product.colors = colorsWithImages;
        }

        await product.save();
        res.json({ success: true, message: "Product updated", product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update an existing color's details
const updateColor = async (req, res) => {
    try {
        const { productId, name, value, stock, oldColorName } = req.body;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Find the color to update
        const colorIndex = product.colors.findIndex(c => c.name === oldColorName);
        if (colorIndex === -1) {
            return res.json({ success: false, message: "Color not found" });
        }

        // Handle new images if provided
        const uploadedFiles = req.files || [];
        let colorImagesUrls = [];
        if (uploadedFiles.length > 0) {
            colorImagesUrls = await Promise.all(
                uploadedFiles.map(async (file) => {
                    let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        // Prepare stock map
        const stockMap = new Map();
        if (stock) {
            const stockObj = typeof stock === 'string' ? JSON.parse(stock) : stock;
            Object.entries(stockObj).forEach(([size, quantity]) => {
                stockMap.set(size, quantity);
            });
        }

        // Update the color
        product.colors[colorIndex] = {
            name,
            value,
            images: colorImagesUrls.length > 0 ? colorImagesUrls : product.colors[colorIndex].images,
            stock: stockMap
        };

        await product.save();
        res.json({ success: true, message: "Color updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateStock, getTotalQuantity, updateStockAfterPurchase, addColorToProduct, updateProduct, updateColor }