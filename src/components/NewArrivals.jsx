import React, { useState, useEffect } from "react";
import { PiShoppingCart } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { USER_BASE_URL } from "../config";

export default function NewArrivals() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch new arrival products from API
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${USER_BASE_URL}/api/products/new-arrivals`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Function to handle adding product to wishlist
  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation();

    if (!userId || !token) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/api/wishlist/add`,
        { productId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  // Function to handle adding product to cart
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();

    if (!userId || !token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/api/cart/add`,
        { productId, userId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  if (loading) {
    return (
      <section className="py-8 lg:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold">New Arrivals</h2>
          <button className="text-lg text-gray-600 hover:text-black">
            View All <span className="ml-1 text-xl">▾</span>
          </button>
        </div>
        <p className="text-lg text-gray-500">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 lg:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold">New Arrivals</h2>
          <button className="text-lg text-gray-600 hover:text-black">
            View All <span className="ml-1 text-xl">▾</span>
          </button>
        </div>
        <p className="text-lg text-red-500">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-semibold">New Arrivals</h2>
        <button className="text-lg text-gray-600 hover:text-black">
          View All <span className="ml-1 text-xl">▾</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
        {products.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-full">
            No new arrivals available.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-xl border border-[#B7B4FF] overflow-hidden transition cursor-pointer h-fit"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative">
                <img
                  src={`${USER_BASE_URL}/${product.images[0]}`}
                  alt={product.name}
                  className="inset-0 w-full h-full object-cover rounded-t-xl"
                  onError={(e) => {
                    e.target.src = "/fallback-image.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

                <div
                  className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity_hid md:group-hover:opacity-100 transition-opacity duration-300 invisible md:visible"
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
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
