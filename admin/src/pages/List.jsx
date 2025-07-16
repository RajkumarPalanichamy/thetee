import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const COLOR_OPTIONS = [
  { name: 'Navy', value: '#001F3F' },
  { name: 'Grey', value: '#808080' },
  { name: 'Black', value: '#000000' },
  { name: 'Olive Green', value: '#556B2F' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Light Pink', value: '#FFB6C1' },
  { name: 'Lavender', value: '#E6E6FA' },
  { name: 'Mint', value: '#98FF98' },
  { name: 'Baby Blue', value: '#ADD8E6' },
  { name: 'Beige', value: '#F5F5DC' },
  { name: 'Brick Red', value: '#8B0000' },
  { name: 'Coffee Brown', value: '#4B3621' },
  { name: 'Copper', value: '#B87333' },
  { name: 'Flag Green', value: '#006400' },
  { name: 'Flamingo', value: '#FC8EAC' },
  { name: 'Golden Yellow', value: '#FFD700' },
  { name: 'Jade', value: '#00A86B' },
  { name: 'Mushroom', value: '#BEBEBE' },
  { name: 'New Yellow', value: '#FFFF00' },
  { name: 'Off White', value: '#FAF9F6' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Peach', value: '#FFE5B4' },
  { name: 'Petrol Blue', value: '#004B6B' },
  { name: 'Purple', value: '#800080' },
  { name: 'Steel Grey', value: '#71797E' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Coral', value: '#FF7F50' },
  { name: 'Mustard Yellow', value: '#FFDB58' },
  { name: 'Maroon', value: '#800000' },
  { name: 'Royal Blue', value: '#4169E1' },
  { name: 'Green', value: '#008000' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Charcoal Melange', value: '#36454F' },
  { name: 'Grey Melange', value: '#A9A9A9' },
  { name: 'Sky Blue', value: '#87CEEB' },
  { name: 'Orchid Blue', value: '#7B68EE' }
];

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [editingStock, setEditingStock] = useState(null) // { productId: string, color: string, size: string }
  const [stockQuantity, setStockQuantity] = useState('')
  const [showEditPriceModal, setShowEditPriceModal] = useState(false)
  const [editPriceProductId, setEditPriceProductId] = useState(null)
  const [editPriceValue, setEditPriceValue] = useState('')
  const [editPriceLoading, setEditPriceLoading] = useState(false)
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorModalMode, setColorModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorName, setColorName] = useState('');
  const [colorValue, setColorValue] = useState('');
  const [colorImages, setColorImages] = useState([null, null, null, null]);
  const [colorStock, setColorStock] = useState({});
  const [colorModalLoading, setColorModalLoading] = useState(false);

  // Product Edit Modal States
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    bestseller: false,
    type: ''
  });
  const [editProductImages, setEditProductImages] = useState([null, null, null, null]);
  const [editProductLoading, setEditProductLoading] = useState(false);
  const [editProductUploadProgress, setEditProductUploadProgress] = useState(0);

  // 1. Add state for sizes, colors, color images, and stock quantities for edit modal
  const [editSizes, setEditSizes] = useState([]);
  const [editColors, setEditColors] = useState([]); // [{ name, value }]
  const [editColorNameInput, setEditColorNameInput] = useState("");
  const [editColorValueInput, setEditColorValueInput] = useState(COLOR_OPTIONS[0].value);
  const [editColorImageFiles, setEditColorImageFiles] = useState({}); // { colorName: [file1, file2, file3, file4] }
  const [editStockQuantities, setEditStockQuantities] = useState({});
  const [editManagingColor, setEditManagingColor] = useState(null);

  // Add state for new images to be added
  const [newEditProductImages, setNewEditProductImages] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const updateStock = async (productId, color, size, quantity) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update-stock',
        { productId, color, size, quantity },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Stock updated successfully')
        setEditingStock(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const startEditingStock = (productId, color, size, currentQuantity) => {
    setEditingStock({ productId, color, size })
    setStockQuantity(currentQuantity.toString())
  }

  const openEditPriceModal = (productId, currentPrice) => {
    setEditPriceProductId(productId)
    setEditPriceValue(currentPrice)
    setShowEditPriceModal(true)
  }

  const closeEditPriceModal = () => {
    setShowEditPriceModal(false)
  }

  const handleEditPriceSubmit = async (e) => {
    e.preventDefault()
    setEditPriceLoading(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update',
        { productId: editPriceProductId, price: parseFloat(editPriceValue) },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Price updated')
        closeEditPriceModal()
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setEditPriceLoading(false)
    }
  }

  const openColorModal = (product, mode, existingColor = null) => {
    setSelectedProduct(product);
    setColorModalMode(mode);
    if (mode === 'edit' && existingColor) {
      setSelectedColor(existingColor);
      setColorName(existingColor.name);
      setColorValue(existingColor.value);
      // Convert existing stock Map to object
      const stockObj = {};
      DEFAULT_SIZES.forEach(size => {
        stockObj[size] = existingColor.stock instanceof Map ? 
          existingColor.stock.get(size) : 
          existingColor.stock?.[size] || 0;
      });
      setColorStock(stockObj);
      setColorImages([null, null, null, null]); // Reset images as we can't pre-fill them
    } else {
      setSelectedColor(null);
      setColorName('');
      setColorValue(COLOR_OPTIONS[0].value);
      // Initialize stock with 0 for all default sizes
      const initialStock = {};
      DEFAULT_SIZES.forEach(size => {
        initialStock[size] = 0;
      });
      setColorStock(initialStock);
      setColorImages([null, null, null, null]);
    }
    setShowColorModal(true);
  };

  const closeColorModal = () => {
    setShowColorModal(false);
    setSelectedProduct(null);
    setSelectedColor(null);
    setColorName('');
    setColorValue('');
    setColorStock({});
    setColorImages([null, null, null, null]);
  };

  const handleColorImageChange = (index, file) => {
    const updated = [...colorImages];
    updated[index] = file;
    setColorImages(updated);
  };

  const handleColorStockChange = (size, value) => {
    setColorStock(prev => ({ ...prev, [size]: parseInt(value) || 0 }));
  };

  const handleColorSubmit = async (e) => {
    e.preventDefault();
    setColorModalLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', selectedProduct._id);
      formData.append('name', colorName);
      formData.append('value', colorValue);
      formData.append('stock', JSON.stringify(colorStock));
      
      // Append any new images
      colorImages.forEach((file, idx) => {
        if (file) formData.append('images', file);
      });

      const endpoint = colorModalMode === 'add' ? '/api/product/add-color' : '/api/product/update-color';
      if (colorModalMode === 'edit') {
        formData.append('oldColorName', selectedColor.name);
      }

      const response = await axios.post(
        backendUrl + endpoint,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(colorModalMode === 'add' ? 'Color added successfully' : 'Color updated successfully');
        closeColorModal();
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setColorModalLoading(false);
    }
  };

  // Product Edit Modal Functions
  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subCategory: product.subCategory,
      bestseller: product.bestseller,
      type: product.type || ''
    });
    setEditProductImages([null, null, null, null]);
    setEditSizes(product.sizes || []);
    setEditColors(product.colors ? product.colors.map(c => ({ name: c.name, value: c.value })) : []);
    // Prefill color images as empty (cannot prefill files)
    setEditColorImageFiles({});
    // Prefill stock quantities
    const stockQ = {};
    if (product.colors && product.sizes) {
      product.colors.forEach(color => {
        product.sizes.forEach(size => {
          stockQ[`${color.name}-${size}`] = color.stock?.[size] || 0;
        });
      });
    }
    setEditStockQuantities(stockQ);
    setEditManagingColor(product.colors && product.colors.length > 0 ? product.colors[0].name : null);
    setShowEditProductModal(true);
  };

  const closeEditProductModal = () => {
    setShowEditProductModal(false);
    setEditingProduct(null);
    setEditProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Men',
      subCategory: 'Topwear',
      bestseller: false,
      type: ''
    });
    setEditProductImages([null, null, null, null]);
    setEditProductUploadProgress(0);
  };

  const handleEditProductImageChange = (index, file) => {
    const updated = [...editProductImages];
    updated[index] = file;
    setEditProductImages(updated);
  };

  // 3. Add handlers for color, size, stock, and image changes (similar to Add.jsx)
  const handleEditColorImageFileChange = (color, index, file) => {
    const newColorImageFiles = { ...editColorImageFiles };
    if (!newColorImageFiles[color]) {
      newColorImageFiles[color] = [null, null, null, null];
    }
    newColorImageFiles[color][index] = file;
    setEditColorImageFiles(newColorImageFiles);
  };
  const handleEditQuantityChange = (color, size, value) => {
    setEditStockQuantities(prev => ({
      ...prev,
      [`${color}-${size}`]: parseInt(value) || 0
    }));
  };
  const addEditColor = () => {
    const selected = COLOR_OPTIONS.find(c => c.name === editColorNameInput) || { name: editColorNameInput, value: editColorValueInput };
    if (
      selected &&
      editColors.length < 7 &&
      !editColors.some(c => c.name === selected.name)
    ) {
      setEditColors([...editColors, selected]);
      setEditColorNameInput("");
      setEditColorValueInput(COLOR_OPTIONS[0].value);
      setEditColorImageFiles({ ...editColorImageFiles, [selected.name]: [null] });
      setEditManagingColor(selected.name); // <-- auto-select new color
    }
  };
  const removeEditColor = (colorToRemove) => {
    setEditColors(editColors.filter(color => color.name !== colorToRemove));
    const newColorImageFiles = { ...editColorImageFiles };
    delete newColorImageFiles[colorToRemove];
    setEditColorImageFiles(newColorImageFiles);
    const remaining = editColors.filter(color => color.name !== colorToRemove);
    setEditManagingColor(remaining.length > 0 ? remaining[0].name : null);
  };

  // Handler to add a new image upload field
  const addNewEditProductImageField = () => {
    setNewEditProductImages(prev => [...prev, null]);
  };
  // Handler to change a new image
  const handleNewEditProductImageChange = (index, file) => {
    setNewEditProductImages(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };
  // Handler to remove a new image field
  const removeNewEditProductImageField = (index) => {
    setNewEditProductImages(prev => prev.filter((_, i) => i !== index));
  };
  // Handler to delete an existing image
  const handleDeleteExistingProductImage = (imgIdx) => {
    setEditingProduct(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== imgIdx)
    }));
  };

  // 4. Update handleEditProductSubmit to include sizes, colors, stock, and color images
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    setEditProductLoading(true);
    setEditProductUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('productId', editingProduct._id);
      formData.append('name', editProductForm.name);
      formData.append('description', editProductForm.description);
      formData.append('price', editProductForm.price);
      formData.append('category', editProductForm.category);
      formData.append('subCategory', editProductForm.subCategory);
      formData.append('bestseller', editProductForm.bestseller);
      formData.append('type', editProductForm.type);
      formData.append('sizes', JSON.stringify(editSizes));
      // Colors and stock
      const colorsForBackend = editColors.map(color => ({
        name: color.name,
        value: color.value,
        stock: editSizes.reduce((acc, size) => {
          acc[size] = editStockQuantities[`${color.name}-${size}`] || 0;
          return acc;
        }, {})
      }));
      formData.append('colors', JSON.stringify(colorsForBackend));
      // Color images
      editColors.forEach(color => {
        if (editColorImageFiles[color.name]) {
          editColorImageFiles[color.name].forEach((imageFile, index) => {
            if (imageFile) {
              formData.append(`${color.name}_image_${index}`, imageFile);
            }
          });
        }
      });
      // Main product images
      editProductImages.forEach((file, idx) => {
        if (file) formData.append('images', file);
      });
      // Append all newEditProductImages to formData as 'images'
      newEditProductImages.forEach((img) => {
        if (img) formData.append('images', img);
      });
      const response = await axios.post(
        backendUrl + '/api/product/update',
        formData,
        {
          headers: { token },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setEditProductUploadProgress(percentCompleted);
          }
        }
      );
      if (response.data.success) {
        toast.success('Product updated successfully');
        closeEditProductModal();
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setEditProductLoading(false);
      setEditProductUploadProgress(0);
    }
  };

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* ------- List Table Title ---------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}
        {list.map((item, index) => (
          <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_2fr] items-center gap-2 py-1 px-2 border text-sm'>
            <img className='w-12' src={item.image[0]} alt="" />
            <div className='flex flex-col gap-1'>
              <p className='font-medium'>{item.name}</p>
            </div>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div className='flex flex-col gap-1'>
              {item.colors?.map((color, colorIndex) => (
                <div key={colorIndex} className='flex flex-wrap gap-2 items-center'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>{color.name}:</span>
                  </div>
                  {item.sizes.map((size, sizeIndex) => {
                    const stock = color.stock instanceof Map ? 
                      color.stock.get(size) : 
                      color.stock?.[size] || 0;
                    const isLowStock = stock > 0 && stock <= 5;
                    return (
                      <div key={sizeIndex} className='flex items-center gap-1'>
                        <span className='text-xs'>{size}:</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            stock === 0 ? 'bg-red-100 text-red-700' :
                            isLowStock ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}
                        >
                          {stock}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className='flex items-center gap-2 justify-end'>
              <button
                className='text-xs bg-blue-500 text-white px-2 py-0.5 rounded'
                onClick={() => openEditProductModal(item)}
              >
                Update Product
              </button>
              <span
                onClick={() => removeProduct(item._id)}
                className='text-right md:text-center cursor-pointer text-lg ml-2'
                title='Delete Product'
              >
                X
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Color Modal (Add/Edit) */}
      {showColorModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded shadow-lg w-full max-w-md relative'>
            <button className='absolute top-2 right-2 text-lg' onClick={closeColorModal}>×</button>
            <h2 className='text-lg font-bold mb-2'>{colorModalMode === 'add' ? 'Add New Color' : 'Edit Color'}</h2>
            <form onSubmit={handleColorSubmit} className='flex flex-col gap-3'>
              <div>
                <label className='block text-sm mb-1'>Color Name</label>
                <select 
                  value={colorName} 
                  onChange={e => {
                    setColorName(e.target.value);
                    const found = COLOR_OPTIONS.find(c => c.name === e.target.value);
                    setColorValue(found ? found.value : '');
                  }} 
                  className='w-full border px-2 py-1 rounded'
                  disabled={colorModalMode === 'edit'}
                >
                  <option value=''>Select Color</option>
                  {COLOR_OPTIONS.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm mb-1'>Color Value</label>
                <input type='text' value={colorValue} readOnly className='w-full border px-2 py-1 rounded bg-gray-100' />
              </div>
              <div>
                <label className='block text-sm mb-1'>Images {colorModalMode === 'edit' ? '(Upload to replace existing)' : ''}</label>
                <div className='flex gap-2 flex-wrap'>
                  {[0,1,2,3].map(idx => (
                    <input
                      key={idx}
                      type='file'
                      accept='image/*'
                      onChange={e => handleColorImageChange(idx, e.target.files[0])}
                      className='w-full'
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className='block text-sm mb-1'>Stock per Size</label>
                <div className='grid grid-cols-2 gap-4'>
                  {DEFAULT_SIZES.map(size => (
                    <div key={size} className='flex items-center gap-2'>
                      <span className='text-sm font-medium w-12'>{size}:</span>
                      <input
                        type='number'
                        min='0'
                        value={colorStock[size] || ''}
                        onChange={e => handleColorStockChange(size, e.target.value)}
                        className='w-24 px-2 py-1 border rounded text-sm'
                        placeholder='0'
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type='submit'
                className='bg-green-600 text-white px-4 py-2 rounded mt-2'
                disabled={colorModalLoading}
              >
                {colorModalLoading ? 'Saving...' : (colorModalMode === 'add' ? 'Add Color' : 'Save Changes')}
              </button>
              {/* Button to open full product edit modal */}
              <button
                type='button'
                className='bg-blue-600 text-white px-4 py-2 rounded mt-2'
                onClick={() => {
                  closeColorModal();
                  openEditProductModal(selectedProduct);
                }}
              >
                Edit Full Product
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Price Modal */}
      {showEditPriceModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded shadow-lg w-full max-w-xs relative'>
            <button className='absolute top-2 right-2 text-lg' onClick={closeEditPriceModal}>×</button>
            <h2 className='text-lg font-bold mb-2'>Edit Price</h2>
            <form onSubmit={handleEditPriceSubmit} className='flex flex-col gap-3'>
              <div>
                <label className='block text-sm mb-1'>New Price</label>
                <input type='number' min='0' step='0.01' value={editPriceValue} onChange={e => setEditPriceValue(e.target.value)} className='w-full border px-2 py-1 rounded' />
              </div>
              <button type='submit' className='bg-green-600 text-white px-4 py-1 rounded' disabled={editPriceLoading}>{editPriceLoading ? 'Saving...' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative'>
            <button className='absolute top-2 right-2 text-lg' onClick={closeEditProductModal}>×</button>
            <h2 className='text-lg font-bold mb-4'>Update Product</h2>
            
            {/* Loading Overlay */}
            {editProductLoading && (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10'>
                <p className='text-lg font-medium mb-4'>Updating...</p>
                <div className='w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                  <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${editProductUploadProgress}%` }}></div>
                </div>
                <p className='mt-2 text-sm text-gray-600'>{editProductUploadProgress}%</p>
              </div>
            )}

            <form onSubmit={handleEditProductSubmit} className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm mb-1'>Product Name</label>
                  <input 
                    type='text' 
                    value={editProductForm.name} 
                    onChange={e => setEditProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className='w-full border px-2 py-1 rounded'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm mb-1'>Price</label>
                  <input 
                    type='number' 
                    min='0' 
                    step='0.01'
                    value={editProductForm.price} 
                    onChange={e => setEditProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className='w-full border px-2 py-1 rounded'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm mb-1'>Description</label>
                <textarea 
                  value={editProductForm.description} 
                  onChange={e => setEditProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className='w-full border px-2 py-1 rounded h-20'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm mb-1'>Category</label>
                  <select 
                    value={editProductForm.category} 
                    onChange={e => setEditProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className='w-full border px-2 py-1 rounded'
                  >
                    <option value='Men'>Men</option>
                    <option value='Women'>Women</option>
                    <option value='Combo'>Combo</option>
                    <option value='Combo7'>Combo7</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm mb-1'>Sub Category</label>
                  <select 
                    value={editProductForm.subCategory} 
                    onChange={e => setEditProductForm(prev => ({ ...prev, subCategory: e.target.value }))}
                    className='w-full border px-2 py-1 rounded'
                  >
                    <option value='Topwear'>Topwear</option>
                    <option value='Bottomwear'>Bottomwear</option>
                    <option value='Dress'>Dress</option>
                    <option value='Outerwear'>Outerwear</option>
                    <option value='Activewear'>Activewear</option>
                    <option value='Loungewear'>Loungewear</option>
                    <option value='Sleepwear'>Sleepwear</option>
                    <option value='Swimwear'>Swimwear</option>
                    <option value='Underwear'>Underwear</option>
                    <option value='Socks'>Socks</option>
                    <option value='Accessories'>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm mb-1'>Type</label>
                  <input 
                    type='text' 
                    value={editProductForm.type} 
                    onChange={e => setEditProductForm(prev => ({ ...prev, type: e.target.value }))}
                    className='w-full border px-2 py-1 rounded'
                    placeholder='Optional'
                  />
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <input 
                  type='checkbox' 
                  id='bestseller'
                  checked={editProductForm.bestseller} 
                  onChange={e => setEditProductForm(prev => ({ ...prev, bestseller: e.target.checked }))}
                  className='w-4 h-4'
                />
                <label htmlFor='bestseller' className='text-sm'>Bestseller</label>
              </div>

              {/* Sizes Section */}
              <div>
                <label className='block text-sm mb-1'>Sizes</label>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {DEFAULT_SIZES.map(size => (
                    <span
                      key={size}
                      className={`text-sm px-2 py-0.5 rounded ${
                        editSizes.includes(size) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => {
                        if (editSizes.includes(size)) {
                          setEditSizes(editSizes.filter(s => s !== size));
                        } else {
                          setEditSizes([...editSizes, size]);
                        }
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <p className='text-xs text-gray-600'>Select sizes to include in this product.</p>
              </div>

              {/* Colors Section */}
              <div>
                <label className='block text-sm mb-1'>Colors</label>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {editColors.map((color, index) => {
                    // Find the image for this color: check editColorImageFiles first, then editingProduct?.colors
                    let imgSrc = null;
                    if (editColorImageFiles[color.name] && editColorImageFiles[color.name][0]) {
                      imgSrc = URL.createObjectURL(editColorImageFiles[color.name][0]);
                    } else {
                      const prodColor = editingProduct?.colors?.find(c => c.name === color.name);
                      if (prodColor && prodColor.image && prodColor.image[0]) {
                        imgSrc = prodColor.image[0];
                      }
                    }
                    return (
                      <span
                        key={color.name}
                        className={`text-sm px-2 py-0.5 rounded flex items-center gap-1 ${editManagingColor === color.name ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setEditManagingColor(color.name)}
                      >
                        {imgSrc && <img src={imgSrc} alt='' className='w-6 h-6 object-cover rounded mr-1' />}
                        {color.name}
                        <button
                          type='button'
                          onClick={e => { e.stopPropagation(); removeEditColor(color.name); }}
                          className='text-red-500 text-xs'
                          title='Remove Color'
                        >
                          X
                        </button>
                      </span>
                    );
                  })}
                </div>
                <p className='text-xs text-gray-600'>Edit or remove colors for this product.</p>
              </div>

              {/* Stock Management */}
              <div>
                <label className='block text-sm mb-1'>Stock per Color & Size</label>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {editColors.map(color => (
                    <div key={color.name} className='bg-gray-50 p-3 rounded-md'>
                      <h3 className='text-sm font-medium mb-2'>{color.name}</h3>
                      {editSizes.map(size => (
                        <div key={size} className='flex items-center justify-between gap-2 mb-1'>
                          <span className='text-xs font-medium'>{size}:</span>
                          <input
                            type='number'
                            min='0'
                            value={editStockQuantities[`${color.name}-${size}`] || ''}
                            onChange={e => handleEditQuantityChange(color.name, size, e.target.value)}
                            className='w-24 px-2 py-1 border rounded text-sm'
                            placeholder='0'
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Product Images Section */}
              <div>
                <label className='block text-sm mb-1'>Product Images</label>
                <div className='flex gap-2 flex-wrap items-center'>
                  {editingProduct?.image?.map((img, idx) => (
                    <div key={idx} className='w-20 h-20 object-cover border rounded overflow-hidden'>
                      <img src={img} alt={`Current image ${idx + 1}`} className='w-full h-full object-cover' />
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex gap-2 mt-4'>
                <button
                  type='submit'
                  className='bg-green-600 text-white px-4 py-2 rounded flex-1'
                  disabled={editProductLoading}
                >
                  {editProductLoading ? 'Updating...' : 'Update Product'}
                </button>
                <button
                  type='button'
                  onClick={closeEditProductModal}
                  className='bg-gray-500 text-white px-4 py-2 rounded'
                  disabled={editProductLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default List