import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GoHeart } from "react-icons/go";
import { USER_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { PiShoppingCart } from "react-icons/pi";
import PaginationComponent from "./PaginationComponent";

const CombosPage = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const perPage = 15;
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });

  const getCategoryFunction = async () => {
    try {
      const response = await axios.get(`${USER_BASE_URL}/api/category`);
      setCategoryList(response?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getSubCategoryFunction = async () => {
    try {
      const response = await axios.get(`${USER_BASE_URL}/api/subcategory`);
      setSubCategoryList(response?.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const getProductDataFunction = async (page = currentPage, filters = {}) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_BASE_URL}/api/products/all-products`,
        {
          page: page,
          perPage: perPage,
          filter: {
            category: filters.category ?? selectedCategories,
            subcat: filters.subcat ?? selectedSubCategories,
            price: filters.price ?? priceRange,
            rating: filters.rating ?? selectedRatings,
          },
        }
      );

      const comboOnly = (response.data.products || []).filter(
        (p) => p.combos === true
      );
      setProducts(comboOnly);

      setTotalPages(Math.ceil(response?.data?.totalProducts / perPage));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryFunction();
    getSubCategoryFunction();
  }, []);

  useEffect(() => {
    getProductDataFunction(currentPage);
  }, [currentPage]);

  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation();

    if (!userId || !token) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    try {
      await axios.post(
        `${USER_BASE_URL}/api/wishlist/add`,
        { productId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Product added to wishlist!");
      navigate("/wishlist");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error adding product to wishlist"
      );
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();

    if (!userId || !token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.post(
        `${USER_BASE_URL}/api/cart/add`,
        { productId, userId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Product added to cart!");
      navigate("/cart");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error adding product to cart"
      );
    }
  };

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) => {
      if (cat === "All Purpose") {
        return prev.includes(cat) ? [] : ["All Purpose"];
      } else {
        const withoutAllPurpose = prev.filter((c) => c !== "All Purpose");
        return withoutAllPurpose.includes(cat)
          ? withoutAllPurpose.filter((c) => c !== cat)
          : [...withoutAllPurpose, cat];
      }
    });
  };

  const handleSubCategoryToggle = (subcat) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subcat)
        ? prev.filter((c) => c !== subcat)
        : [...prev, subcat]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    getProductDataFunction(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedRatings([]);
    setPriceRange({ min: null, max: null });
    setCurrentPage(1); // Reset to first page
    getProductDataFunction(1, {
      category: [],
      subcat: [],
      price: { min: null, max: null },
      rating: [],
      combos: true, // Ensure combos filter is applied even when clearing filters
    });
  };

  if (loading) {
    return (
      <section className="container mx-auto py-12 px-2 md:px-4 lg:px-10 xl:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
          Combos
        </h2>
        <p className="text-lg md:text-xl text-gray-500 mb-6">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-12 px-2 md:px-4 lg:px-10 xl:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
          Combos
        </h2>
        <p className="text-lg md:text-xl text-red-500 mb-6">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-2 md:px-4 lg:px-10 xl:px-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
        Combos
      </h2>
      <p className="text-lg md:text-xl text-gray-500 mb-6">Home / Combos</p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 space-y-4 md:space-y-0 md:gap-4">
        {/* Sidebar */}
        <aside className="lg:col-span-2 xl:col-span-2 p-1 md:p-0 lg:p-4 py-4 border border-[#B7B4FF] rounded-lg space-y-4 text-sm bg-white h-fit">
          <div>
            <h3 className="font-semibold text-xl lg:text-2xl pt-4 px-4">
              Categories
            </h3>
            <ul className="p-2 px-4">
              {categoryList?.map((cat) => (
                <li key={cat?.id}>
                  <label className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat?.id)}
                      onChange={() => handleCategoryToggle(cat?.id)}
                      className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 accent-[#393185]"
                    />
                    <span className="text-lg lg:text-xl text-gray-400 font-medium">
                      {cat?.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl lg:text-2xl pt-4 px-4">
              SubCategories
            </h3>
            <ul className="p-2 px-4">
              {subCategoryList
                ?.filter((sub) => selectedCategories.includes(sub.cate_id))
                ?.map((subcat) => (
                  <li key={subcat?.sub_cate_id}>
                    <label className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(
                          subcat?.sub_cate_id
                        )}
                        onChange={() =>
                          handleSubCategoryToggle(subcat?.sub_cate_id)
                        }
                        className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 accent-[#393185]"
                      />
                      <span className="text-lg lg:text-xl text-gray-400 font-medium">
                        {subcat?.sub_cate_name}
                      </span>
                    </label>
                  </li>
                ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="pb-2 px-4">
            <h3 className="font-semibold mb-2 text-xl lg:text-2xl">
              Price Range
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-base lg:text-lg text-gray-500">
                    Min
                  </span>
                  <input
                    type="text"
                    value={priceRange.min ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPriceRange({
                        ...priceRange,
                        min: value === "" ? null : parseInt(value) || 0,
                      });
                    }}
                    placeholder="₹0"
                    className="border border-gray-400 rounded px-2 py-2 lg:py-3 w-full text-base lg:text-lg"
                  />
                </div>
                <div>
                  <span className="text-base lg:text-lg text-gray-500">
                    Max
                  </span>
                  <input
                    type="text"
                    value={priceRange.max ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPriceRange({
                        ...priceRange,
                        max: value === "" ? null : parseInt(value) || 9999999,
                      });
                    }}
                    placeholder="₹2000"
                    className="border border-gray-400 rounded px-2 py-2 lg:py-3 w-full text-base lg:text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="pb-4 px-4">
            <h3 className="font-semibold mb-2 text-xl lg:text-2xl">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3].map((stars) => (
                <label key={stars} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(stars)}
                    onChange={() => handleRatingToggle(stars)}
                    className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 accent-[#393185]"
                  />
                  <span className="text-2xl lg:text-3xl flex items-center">
                    <span className="text-[#393185]">{"★".repeat(stars)}</span>
                    <span className="text-gray-400">
                      {"☆".repeat(5 - stars)}
                    </span>
                    {stars !== 5 && (
                      <span className="text-base text-gray-400 ml-1">
                        {" "}
                        & Up
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              className="bg-[#393185] text-white px-4 py-2 rounded-lg font-bold"
              onClick={handleApplyFilters}
            >
              Apply Filter
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-lg font-bold"
              onClick={handleClearFilters}
            >
              Clear Filter
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="col-span-2 lg:col-span-4 xl:col-span-6">
          <div className="col-span-2 lg:col-span-4 xl:col-span-6 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {products.length === 0 ? (
              <p className="text-lg text-gray-500 col-span-full">
                No combos products match the selected filters.
              </p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="group relative rounded-xl border border-[#B7B4FF] overflow-hidden transition h-fit cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative">
                    <img
                      src={`${USER_BASE_URL}/${product.images[0]}`}
                      alt={product.name}
                      className="w-full bg-blue-100"
                      onError={(e) => {
                        e.target.src = "/fallback-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

                    {/* Icons on Hover */}
                    <div
                      className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300 invisible md:visible"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleAddToWishlist(product.id, e)}
                        className="text-white p-3 bg-[#393185] text-2xl rounded-full focus:outline-none cursor-pointer"
                      >
                        <GoHeart />
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        className="text-white p-3 bg-[#393185] text-2xl rounded-full focus:outline-none cursor-pointer"
                      >
                        <PiShoppingCart />
                      </button>
                    </div>
                  </div>
                  <div className="py-4 px-3">
                    <h3 className="text-sm font-medium text-black truncate whitespace-nowrap overflow-hidden">
                      {product.name}
                    </h3>
                    <p className="text-[#393185] text-sm font-semibold mt-1">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
};

export default CombosPage;
