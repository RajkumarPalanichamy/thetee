import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Logo from "../assets/TheTeeLogo.png"

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  
  const navigate = useNavigate();

  const {
    setShowSearch,
    getCartItemCount,
    token,
    setToken,
    setCartItems,
    backendUrl,
  } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCartItems({});
    
    navigate("/");
  };

  return (
    <div className="fixed top-8 left-0 right-0 bg-white shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between font-medium">
        
        {/* Logo */}
       <Link
  to="/"
  className="flex items-center text-xl sm:text-2xl font-bold text-gray-800 hover:text-black transition-colors duration-200"
>
  <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
  <span className=" font-semibold font-mono">THE </span><span className="text-red-700 font-mono">TEE</span>
</Link>


        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          {["/", "/collection", "/about", "/contact"].map((path, index) => (
            <NavLink
              key={index}
              to={path}
              className="flex flex-col items-center gap-1 hover:text-black"
            >
              <p>{path === "/" ? "HOME" : path.slice(1).toUpperCase()}</p>
            </NavLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="search"
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
          />

          {/* Profile Dropdown */}
          <div className="relative group">
            <img
              src={assets.profile_icon}
              alt="profile"
              className="w-5 cursor-pointer"
              onClick={() => token ? null : navigate("/login")}
            />
            {token && (
              <div className="absolute right-0 mt-0 hidden group-hover:block bg-slate-100 rounded shadow text-sm text-gray-600 z-50">
                <div className="flex flex-col gap-2 py-3 px-5 w-48">
                  
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="cart" />
            <span className="absolute right-[-6px] bottom-[-5px] w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
              {getCartItemCount()}
            </span>
          </Link>

          {/* Mobile Menu Icon */}
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu"
            onClick={() => setVisible(true)}
          />
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed mt-10 top-0 right-0 h-full bg-white transition-all duration-300 ease-in-out z-50 shadow-md ${
            visible ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col text-gray-700 h-full">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-4 cursor-pointer border-b"
            >
              <img
                className="h-4 transform rotate-180"
                src={assets.dropdown_icon}
                alt="back"
              />
              <p>Back</p>
            </div>
            {["/", "/collection", "/about", "/contact"].map((path, i) => (
              <NavLink
                key={i}
                onClick={() => setVisible(false)}
                className="py-3 px-6 border-b hover:bg-gray-100"
                to={path}
              >
                {path === "/" ? "HOME" : path.slice(1).toUpperCase()}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
