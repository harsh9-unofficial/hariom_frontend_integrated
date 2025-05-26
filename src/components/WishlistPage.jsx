import React, { useState, useEffect } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_BASE_URL } from "../config";

// Assuming ErrorDisplay is imported from a shared location
function ErrorDisplay() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-45 gap-5">
      <h2 className="text-xl font-semibold mb-2">
        Please log in to view your Wishlist.
      </h2>
      <Link to="/login">
        <button className="bg-[#393185] text-white px-6 py-2 rounded cursor-pointer transition">
          Log In
        </button>
      </Link>
    </div>
  );
}

// Empty Wishlist UI
function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-45 gap-5">
      <h2 className="text-xl font-semibold mb-2">
        Your Wishlist is Currently Empty.
      </h2>
      <Link to="/products">
        <button className="bg-[#393185] text-white px-6 py-2 rounded cursor-pointer transition">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Helper function to parse and get image URL
  const getImageUrl = (images) => {
    try {
      const parsedImages =
        typeof images === "string" ? JSON.parse(images) : images;
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        return `${USER_BASE_URL}/${parsedImages[0].replace(/^\//, "")}`;
      }
      return "/path/to/placeholder-image.jpg";
    } catch (err) {
      console.error("Error parsing images:", err);
      return "/path/to/placeholder-image.jpg";
    }
  };

  // Fetch wishlist items
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${USER_BASE_URL}/api/wishlist/get/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Wishlist Response:", response.data);
      setWishlistItems(response.data);
    } catch (err) {
      setError("Failed to fetch wishlist items");
      toast.error("Error loading wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const deleteItem = async (wishlistId) => {
    try {
      await axios.delete(`${USER_BASE_URL}/api/wishlist/remove/${wishlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== wishlistId)
      );
      toast.success("Item removed from wishlist");
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${USER_BASE_URL}/api/cart/add`,
        { userId, productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Item added to cart");
    } catch (err) {
      toast.error("Error adding item to cart");
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchWishlistItems();
    } else {
      setError("Please log in to view your Wishlist");
      setLoading(false);
    }
  }, [userId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#393185]"></div>
      </div>
    );
  }

  if (error === "Please log in to view your Wishlist") {
    return <ErrorDisplay />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchWishlistItems}
          className="mt-4 bg-[#393185] text-white px-6 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-10 xl:px-8 py-12">
      <h1 className="text-4xl font-semibold mb-2">Wishlist</h1>
      <p className="text-gray-500 mb-8 text-lg">Home / Wishlist</p>

      {wishlistItems.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <>
          <div className="hidden md:grid grid-cols-7 font-semibold text-gray-600 border-b border-gray-300 gap-4 pb-2">
            <div className="col-span-1">Product</div>
            <div className="col-span-4">Description</div>
            <div>Total</div>
            <div className="text-center">Actions</div>
          </div>

          {wishlistItems.map((item) => {
            const imageUrl = item.Product?.images
              ? getImageUrl(item.Product.images)
              : "/path/to/placeholder-image.jpg";

            return (
              <div
                key={item.id}
                className="border-b border-gray-300 py-4 md:py-6 flex flex-col md:grid md:grid-cols-7 gap-4 items-center"
              >
                {/* Mobile layout */}
                <div className="w-full flex md:hidden items-center justify-between gap-6">
                  <img
                    src={imageUrl}
                    alt={item.Product?.name || "Product"}
                    className="w-26 h-26 object-cover rounded"
                    onError={(e) =>
                      (e.target.src = "/path/to/placeholder-image.jpg")
                    }
                  />
                  <div className="flex-1">
                    <p className="text-base font-semibold">
                      {item.Product?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{item.Product?.price?.toFixed(2) || "0.00"}
                    </p>
                    <div className="flex items-center gap-8 mt-2">
                      <button
                        onClick={() => addToCart(item.productId)}
                        className="bg-[#393185] text-white text-xs px-4 py-2 rounded"
                      >
                        Add to Cart
                      </button>
                      <Trash2
                        size={18}
                        className="text-gray-600 hover:text-red-500 cursor-pointer"
                        onClick={() => deleteItem(item.id)}
                      />
                    </div>
                  </div>
                </div>

                {/* Desktop & Tablet Layout */}
                <div className="hidden md:flex col-span-1 justify-center md:justify-start">
                  <img
                    src={imageUrl}
                    alt={item.Product?.name || "Product"}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded object-cover"
                    onError={(e) =>
                      (e.target.src = "/path/to/placeholder-image.jpg")
                    }
                  />
                </div>

                <div className="hidden md:block col-span-2 text-center md:text-left">
                  <p className="text-lg font-medium">
                    {item.Product?.name || "N/A"}
                  </p>
                </div>

                <div className="hidden md:flex col-span-2 justify-center md:justify-start">
                  <button
                    onClick={() => addToCart(item.productId)}
                    className="bg-[#393185] text-white px-6 py-2 sm:px-10 sm:py-3 rounded text-sm cursor-pointer transition"
                  >
                    Add To Cart
                  </button>
                </div>

                <div className="hidden md:block text-lg font-medium text-center md:text-left">
                  ₹{item.Product?.price?.toFixed(2) || "0.00"}
                </div>

                <div className="hidden md:flex justify-center">
                  <Trash2
                    className="text-gray-600 hover:text-red-500 cursor-pointer"
                    onClick={() => deleteItem(item.id)}
                  />
                </div>
              </div>
            );
          })}

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              to="/products"
              className="flex items-center w-fit gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm text-gray-600"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
