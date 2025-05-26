import { useState, useEffect } from "react";
import { PiShoppingCart } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";

export default function BestSellers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch best sellers on component mount
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/api/products/best-sellers`
        );

        const data = Array.isArray(response.data) ? response.data : [];
        console.log("Best Sellers Data:", data);

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
        setError("Failed to load best sellers");
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <section className="py-8 lg:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Best Sellers
        </h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 lg:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Best Sellers
        </h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-semibold">Best Sellers</h2>
        <button className="text-lg text-gray-600 hover:text-black">
          View All <span className="ml-1 text-xl">▾</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-xl border border-[#B7B4FF] overflow-hidden transition cursor-pointer h-fit"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Product Image with Black Shade on Hover */}
              <div className="relative">
                <img
                  src={`${USER_BASE_URL}/${product.image}`} // Fixed: Changed to product.image
                  alt={product.name}
                  className="w-full bg-blue-100"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />

                {/* Black shade overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

                {/* Icons on Hover */}
                <div
                  className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300 invisible md:visible"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="text-white p-3 bg-[#393185] text-2xl rounded-full focus:outline-none cursor-pointer"
                  >
                    <GoHeart />
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-white p-3 bg-[#393185] text-2xl rounded-full focus:outline-none cursor-pointer"
                  >
                    <PiShoppingCart />
                  </button>
                </div>
              </div>

              {/* Product Details */}
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
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </section>
  );
}
