import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    },[location])
    
  return showSearch && visible ? (
   <div className=' bg-gray-50 text-center mt-28 px-2'>
  <div className='inline-flex items-center justify-center border border-gray-400 px-6 py-2 my-5 mx-2 rounded-full w-full sm:w-3/4 max-w-xl bg-white'>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className='flex-1 outline-none bg-inherit text-sm px-2'
      type="text"
      placeholder='Search'
    />
    <img className='w-4' src={assets.search_icon} alt="search" />
  </div>
  <img
    onClick={() => setShowSearch(false)}
    className='inline w-3 cursor-pointer'
    src={assets.cross_icon}
    alt="close"
  />
</div>

  ) : null
}

export default SearchBar
