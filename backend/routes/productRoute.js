import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, updateStock, addColorToProduct, updateProduct, updateColor } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.any(),addProduct);
productRouter.get('/list',listProducts)
productRouter.post('/remove',adminAuth,removeProduct)
productRouter.post('/single',singleProduct)
productRouter.post('/update-stock', adminAuth, updateStock);
productRouter.post('/add-color', adminAuth, upload.any(), addColorToProduct);
productRouter.post('/update', adminAuth, upload.any(), updateProduct);
productRouter.post('/update-color', adminAuth, upload.any(), updateColor);

export default productRouter