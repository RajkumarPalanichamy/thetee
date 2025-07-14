import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true }, // Main images
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    type: { type: String },
    sizes: { type: Array, required: true },
    colors: [{ // Array of color objects
        name: { type: String, required: true },
        value: { type: String }, // hex color value
        images: { type: Array, required: true }, // Array of image URLs for this color
        stock: { // Stock information for each size
            type: Map,
            of: Number,
            default: new Map()
        }
    }],
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel