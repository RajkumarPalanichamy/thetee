import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
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
  { name: 'Orchid Blue', value: '#7B68EE' },
   {name: "Multi", value: "#36454F"}
];

const Add = ({token}) => {

  // State to track which color's images are currently being managed/previewed
  const [managingColor, setManagingColor] = useState(null); // null initially, will manage first color added

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Men");
   const [subCategory, setSubCategory] = useState("Topwear");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);
   const [colors, setColors] = useState([]); // [{ name: "Red", value: "#ff0000" }]
   const [colorNameInput, setColorNameInput] = useState("");
   const [colorValueInput, setColorValueInput] = useState(COLOR_OPTIONS[0].value); // default to first color
   // Store actual image files by color name: { colorName: [file1, file2, file3, file4] }
   const [colorImageFiles, setColorImageFiles] = useState({});
   const [stockQuantities, setStockQuantities] = useState({}); // New state for stock quantities

   // State for loading and progress
   const [loading, setLoading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);

   const handleColorImageFileChange = (color, index, file) => {
    const newColorImageFiles = { ...colorImageFiles };
    if (!newColorImageFiles[color]) {
        newColorImageFiles[color] = [null, null, null, null];
    }
    newColorImageFiles[color][index] = file;
    setColorImageFiles(newColorImageFiles);
   };

   const addColor = () => {
     const selected = COLOR_OPTIONS.find(c => c.name === colorNameInput);
     if (
       selected &&
       colors.length < 7 &&
       !colors.some(c => c.name === selected.name)
     ) {
       setColors([...colors, selected]);
       setColorNameInput("");
       setColorValueInput(COLOR_OPTIONS[0].value);
       setColorImageFiles({ ...colorImageFiles, [selected.name]: [null, null, null, null] });
       setManagingColor(selected.name);
     } else if (colors.length >= 7) {
        toast.error("You can add up to 7 colors.");
     } else if (selected && colors.some(c => c.name === selected.name)) {
        toast.error("Color already added.");
     }
   };

   const removeColor = (colorToRemove) => {
     setColors(colors.filter(color => color.name !== colorToRemove));
     const newColorImageFiles = {...colorImageFiles};
     delete newColorImageFiles[colorToRemove];
     setColorImageFiles(newColorImageFiles);
     if (managingColor === colorToRemove) {
        // If the removed color was being managed, set managingColor to the first color if any remain, otherwise null
        const remaining = colors.filter(color => color.name !== colorToRemove);
        setManagingColor(remaining.length > 0 ? remaining[0].name : null);
     }
   };

   const handleQuantityChange = (color, size, value) => {
     setStockQuantities(prev => ({
       ...prev,
       [`${color}-${size}`]: parseInt(value) || 0
     }));
   };

   const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      
      // Append color names, values, and their stock quantities
      const colorsForBackend = colors.map(color => ({
        name: color.name,
        value: color.value,
        stock: sizes.reduce((acc, size) => {
          acc[size] = stockQuantities[`${color.name}-${size}`] || 0;
          return acc;
        }, {})
      }));
      formData.append("colors",JSON.stringify(colorsForBackend));

      // Append color-specific image files
      colors.forEach(color => {
        if (colorImageFiles[color.name]) {
            colorImageFiles[color.name].forEach((imageFile, index) => {
                if (imageFile) {
                    // Use a field name that includes the color name
                    formData.append(`${color.name}_image_${index}`, imageFile);
                }
            });
        }
      });

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}, onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }});

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setPrice('');
        setColors([]);
        setColorImageFiles({});
        setManagingColor(null); // Reset managing color after submission
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
        setLoading(false);
        setUploadProgress(0);
    }
   }

   // Determine which images to display in the main preview - now always based on managingColor
   const imagesToPreview = managingColor === null && colors.length > 0 ? colorImageFiles[colors[0].name] : colorImageFiles[managingColor] || [null, null, null, null];
   const previewTitle = managingColor === null && colors.length > 0 ? `Images for ${colors[0].name} Preview` : managingColor !== null ? `Images for ${managingColor} Preview` : "Select a color to manage images";

   const isCombo7 = category === 'Combo7';


  return (
    <div className='relative'>
        {/* Loading Overlay */}
        {loading && (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50'>
                <p className='text-lg font-medium mb-4'>Uploading...</p>
                <div className='w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                  <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className='mt-2 text-sm text-gray-600'>{uploadProgress}%</p>
            </div>
        )}

        <form onSubmit={onSubmitHandler} className={`flex flex-col w-full items-start gap-3 ${loading ? 'pointer-events-none' : ''}`}> {/* Disable form when loading */}

            {/* Combo7 Note */}
            {isCombo7 && (
              <div className="w-full mb-4 p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-800 rounded">
                <strong>Combo7:</strong> Add up to 7 T-shirt options, each with color and stock. These will be shown as selectable options for customers on the Combo7 product page.
              </div>
            )}

            {/* Top Section: Image Preview and Details */}
            <div className='flex gap-8 w-full'>

                {/* Image Preview Column */}
                <div className='flex flex-col gap-4'>
                     {/* Main large preview image */}
                     <div className='w-60 h-60 border flex items-center justify-center'> {/* Adjust size as needed */} 
                        {imagesToPreview[0] ? (
                           <img className='w-full h-full object-cover' src={URL.createObjectURL(imagesToPreview[0])} alt="Product image preview" />
                        ) : (
                           <span className='text-gray-500 text-sm'>No Image</span>
                        )}
                     </div>
                     {/* Small preview images */}
                     <div className='flex gap-2'>
                        {imagesToPreview.slice(1).map((image, index) => (
                            <div key={index} className='w-16 h-16 border flex items-center justify-center'> {/* Adjust size as needed */} 
                                {image ? (
                                   <img className='w-full h-full object-cover' src={URL.createObjectURL(image)} alt="Product image preview" />
                                ) : (
                                   <span className='text-gray-500 text-sm'>No Image</span>
                                )}
                            </div>
                        ))}
                     </div>
                </div>

                {/* Product Details Column */}
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='w-full'>
                      <p className='mb-2'>Product name</p>
                      <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full px-3 py-2' type="text" placeholder='Type here' required/>
                    </div>

                    <div className='w-full'>
                      <p className='mb-2'>Product description</p>
                      <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full px-3 py-2' type="text" placeholder='Write content here' required/>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

                        <div>
                          <p className='mb-2'>Product category</p>
                          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                              <option value="Men">Men</option>
                              <option value="Women">Women</option>
                              <option value="Kids">Kids</option>
                              <option value="Combo">Combo</option>
                              <option value="Combo7">Combo7</option>

                          </select>
                        </div>

                        <div>
                          <p className='mb-2'>Sub category</p>
                          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                              <option value="Topwear">Topwear</option>
                              <option value="Bottomwear">Bottomwear</option>
                              <option value="Winterwear">Winterwear</option>
                          </select>
                        </div>

                        <div>
                          <p className='mb-2'>Product Price</p>
                          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
                        </div>
                    </div>

                     <div>
                      <p className='mb-2'>Product Sizes</p>
                      <div className='flex gap-3'>
                        <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter( item => item !== "S") : [...prev,"S"])}>
                          <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>S</p>
                        </div>
                        
                        <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter( item => item !== "M") : [...prev,"M"])}>
                          <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>M</p>
                        </div>

                        <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter( item => item !== "L") : [...prev,"L"])}>
                          <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>L</p>
                        </div>

                        <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter( item => item !== "XL") : [...prev,"XL"])}>
                          <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XL</p>
                        </div>

                        <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter( item => item !== "XXL") : [...prev,"XXL"])}>
                          <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XXL</p>
                        </div>
                      </div>
                    </div>

                    <div className='w-full mt-4'>
                      <p className='mb-2'>Stock Quantities</p>
                      {isCombo7 && (
                        <div className='mb-2 text-xs text-orange-700'>You can add up to 7 colors for Combo7 products.</div>
                      )}
                      {colors.length > 0 && sizes.length > 0 && (
                        <div className={`grid grid-cols-1 gap-4 ${isCombo7 ? 'bg-orange-50 p-2 rounded' : ''}`}>
                          {colors.map(color => (
                            <div key={color.name} className={`border p-4 rounded ${isCombo7 ? 'border-orange-300' : ''}`}>
                              <h3 className='font-medium mb-2'>{color.name}</h3>
                              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                                {sizes.map(size => (
                                  <div key={`${color.name}-${size}`}>
                                    <label className='block text-sm mb-1'>{size}</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={stockQuantities[`${color.name}-${size}`] || 0}
                                      onChange={(e) => handleQuantityChange(color.name, size, e.target.value)}
                                      className='w-full px-3 py-2 border rounded'
                                      placeholder='Quantity'
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className='flex gap-2 mt-2'>
                      <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
                      <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
                    </div>
                </div>

            </div>

            {/* Color Selection and Image Uploads Section */}
            <div className='w-full mt-8'>
                <p className='mb-2 font-medium'>Manage Images by Color</p>
                <div className='flex gap-4 mb-4 items-center'>
                    {/* Color list for selection */}
                    {colors.map((color, index) => (
                        <span 
                            key={index} 
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer relative ${managingColor === color.name ? 'border-black' : 'border-gray-300'}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setManagingColor(color.name)}
                        >
                            {managingColor === color.name && (
                              <span
                                style={{
                                  position: 'absolute',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '1.5rem',
                                  pointerEvents: 'none',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  textShadow: '0 0 4px #000',
                                }}
                              >&#10003;</span>
                            )}
                        </span>
                    ))}
                    {/* Add new color input and button */}
                     <div className='flex gap-3 items-center'>
                        <select
                          value={colorNameInput}
                          onChange={e => {
                            setColorNameInput(e.target.value);
                            const selected = COLOR_OPTIONS.find(c => c.name === e.target.value);
                            setColorValueInput(selected ? selected.value : COLOR_OPTIONS[0].value);
                          }}
                          className='px-3 py-2 border min-w-[140px]'
                        >
                          <option value=''>Select color</option>
                          {COLOR_OPTIONS.map(option => (
                            <option
                              key={option.name}
                              value={option.name}
                              disabled={colors.some(c => c.name === option.name)}
                            >
                              {option.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={addColor}
                          className='bg-black text-white px-4 py-2'
                          disabled={!colorNameInput || (isCombo7 && colors.length >= 7)}
                        >
                          Add Color
                        </button>
                      </div>
                </div>

                {/* Image Uploads for Selected Color */} 
                {managingColor !== null && (
                    <div className='border p-4'>
                        <p className='mb-2 text-sm font-medium'>{`Upload Images for ${managingColor} (up to 4)`}</p>
                         <div className='flex gap-2'>
                             {(colorImageFiles[managingColor] || [null, null, null, null]).map((image, index) => (
                                 <label key={index} htmlFor={`${managingColor}_image_${index}`}>
                                     <img className='w-20 cursor-pointer object-cover' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Image upload" />
                                     <input 
                                        onChange={(e) => handleColorImageFileChange(managingColor, index, e.target.files[0])}
                                        type="file" 
                                        id={`${managingColor}_image_${index}`} 
                                        hidden
                                    />
                                </label>
                            ))}
                         </div>
                         <button 
                            type="button" 
                            onClick={() => removeColor(managingColor)}
                            className='mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm'
                         >
                            Remove {managingColor} Color
                         </button>
                    </div>
                 )}
            </div>

            <button type="submit" className='w-28 py-3 mt-8 bg-black text-white' disabled={loading}>ADD PRODUCT</button>

        </form>
    </div>
  )
}

export default Add