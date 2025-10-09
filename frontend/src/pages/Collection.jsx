import React, { useContext, useEffect, useState, lazy, Suspense } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { Helmet } from 'react-helmet';
import { useLocation } from "react-router-dom";

const ProductItem = lazy(() => import('../components/ProductItem'));

const ProductSkeleton = () => (
  <div className="animate-pulse rounded-lg bg-white shadow p-4 space-y-3">
    <div className="h-40 bg-gray-200 rounded" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

const CATEGORY_LABELS = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Kids', label: 'Kids' },
  { value: 'Combo', label: 'Combo T-Shirts' },
  { value: 'Customization', label: 'Customization' },
];

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam && CATEGORY_LABELS.map(c => c.value).includes(categoryParam)) {
      setCategory([categoryParam]);
    }
  }, [location.search]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) =>
        category.some((cat) => {
          if (cat === 'Combo') return item.category === 'Combo' || item.category === 'Combo7';
          return item.category === cat;
        })
      );
    } else {
      filtered = filtered.filter((item) => item.category !== 'Combo7');
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(filtered);
    setLoading(false);
  };

  const sortProduct = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }

    setFilterProducts(sorted);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <Helmet>
        <title>Shop Collection - The Tee</title>
        <meta name="description" content="Explore the full collection of The Tee – trendy t-shirts, hoodies, and fashion essentials for all." />
        <meta name="keywords" content="The Tee collection, t-shirts, hoodies, men, women, kids, fashion, shopping" />
        <meta property="og:title" content="Shop Collection - The Tee" />
        <meta property="og:description" content="Discover premium quality clothing for men, women, and kids in our collection." />
        <meta property="og:url" content="https://thetee.in/collection" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thetee.in/collection" />
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-6 pt-6 lg:pt-10">
        {/* Sidebar */}
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-4">
            <p
              onClick={() => setShowFilter(!showFilter)}
              className="text-xl lg:text-2xl font-semibold text-gray-900 flex items-center justify-between border-b border-gray-900 border-2 pb-3 lg:border-none  p-2 cursor-pointer sticky"
            >
              Filters
              <img
                className={`h-4 lg:hidden transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}
                src={assets.dropdown_icon}
                alt="dropdown"
              />
            
            </p>

            {/* Category */}
            <div className={`bg-white rounded-lg shadow-md p-4 lg:p-5 mt-4 ${showFilter ? '' : 'hidden'} lg:block`}>
              <p className="mb-4 text-base font-bold text-gray-800">CATEGORIES</p>
              <div className="flex flex-col gap-3 text-sm lg:text-base text-gray-700">
                {CATEGORY_LABELS.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 lg:h-5 lg:w-5 text-blue-600"
                      value={cat.value}
                      onChange={toggleCategory}
                      checked={category.includes(cat.value)}
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            {/* SubCategory */}
            <div className={`bg-white rounded-lg shadow-md p-4 lg:p-5 my-4 ${showFilter ? '' : 'hidden'} lg:block`}>
              <p className="mb-4 text-base font-bold text-gray-800">TYPE</p>
              <div className="flex flex-col gap-3 text-sm lg:text-base text-gray-700">
                {['Topwear', 'Bottomwear', 'Winterwear'].map((sub) => (
                  <label key={sub} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 lg:h-5 lg:w-5 text-blue-600"
                      value={sub}
                      onChange={toggleSubCategory}
                      checked={subCategory.includes(sub)}
                    />
                    {sub}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 uppercase">Collections</h2>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="w-full sm:w-auto border-2 border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Combo7 section under Combo T-Shirts */}
          {category.includes('Combo') && (
            <>
              {/* Regular Combo products */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Combo T-Shirts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filterProducts.filter(item => item.category === 'Combo').map(item => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                    />
                  ))}
                </div>
              </div>
              {/* Combo7 products */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-4 text-orange-700">Combo 31: Pick Any 4 at ₹899 only</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filterProducts.filter(item => item.category === 'Combo7').map(item => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Product Display (hide Combo7 if Combo is selected) */}
          {!category.includes('Combo') && (
            loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            ) : filterProducts.length > 0 ? (
              <Suspense fallback={
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <ProductSkeleton key={idx} />
                  ))}
                </div>
              }>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filterProducts.filter(item => item.category !== 'Combo7').map((item) => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                    />
                  ))}
                </div>
              </Suspense>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-600">No products available</h3>
                <p className="text-sm sm:text-base text-gray-500 mt-2">
                  We're updating our collections. Please check back soon!
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
