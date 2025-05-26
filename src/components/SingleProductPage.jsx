import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import toast from "react-hot-toast";

const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${USER_BASE_URL}/api/products/${id}`);
        let images = response.data.images;
        if (typeof images === "string") {
          try {
            images = JSON.parse(images);
          } catch (e) {
            console.error("Error parsing images:", e);
            images = [];
          }
        }
        images = Array.isArray(images) ? images : images ? [images] : [];

        let features = response.data.features;
        if (typeof features === "string") {
          try {
            features = JSON.parse(features.replace(/'/g, '"'));
          } catch (e) {
            console.error("Error parsing features:", e);
            features = features
              ? features
                  .split(",")
                  .map((item) => item.trim().replace(/^'|'$/g, ""))
              : [];
          }
        }
        features = Array.isArray(features)
          ? features
          : features
          ? [features]
          : [];

        let howToUse = response.data.howToUse;
        if (typeof howToUse === "string") {
          try {
            howToUse = JSON.parse(howToUse.replace(/'/g, '"'));
          } catch (e) {
            console.error("Error parsing howToUse:", e);
            howToUse = howToUse
              ? howToUse
                  .split(",")
                  .map((item) => item.trim().replace(/^'|'$/g, ""))
              : [];
          }
        }
        howToUse = Array.isArray(howToUse)
          ? howToUse
          : howToUse
          ? [howToUse]
          : [];

        const normalizedProduct = {
          ...response.data,
          images,
          features,
          howToUse,
          shortDescription: response.data.shortDescription || "",
          longDescription: response.data.longDescription || "",
          averageRatings: response.data.averageRatings || 0,
          totalReviews: response.data.totalReviews || 0,
        };

        normalizedProduct.features = [...new Set(normalizedProduct.features)];
        setProduct(normalizedProduct);

        const firstImage = normalizedProduct.images[0]
          ? `${USER_BASE_URL}/${normalizedProduct.images[0]}`
          : "/images/Product1.png";
        setMainImage(firstImage);
      } catch (err) {
        setError(
          "Failed to load product data: " +
            (err.response?.data?.message || err.message)
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (activeTab === "review") {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `${USER_BASE_URL}/api/ratings/products/${id}`
          );
          setReviews(response.data.slice(0, 2));
        } catch (err) {
          console.error("Fetch reviews error:", err);
          toast.error("Failed to load reviews.");
        }
      };
      fetchReviews();
    }
  }, [activeTab, id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.post(
        `${USER_BASE_URL}/api/cart/add`,
        {
          userId: parseInt(userId),
          productId: parseInt(id),
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }

    if (!product || !product.id) {
      console.error("Product data is invalid or missing:", product);
      toast.error("Product data is unavailable. Please try again.");
      return;
    }

    navigate("/checkout", {
      state: { product: { ...product, quantity } },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabClass = (tab) =>
    `py-2 px-4 text-lg font-medium transition-colors duration-200 ease-in-out cursor-pointer ${
      activeTab === tab
        ? "border-b-2 border-[#393185] text-[#393185]"
        : "text-gray-600 hover:text-[#393185]"
    }`;

  const handleSave = async () => {
    if (rating > 0 && feedback.trim()) {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        toast.error("Please log in to submit a review.");
        return;
      }

      try {
        const response = await axios.post(
          `${USER_BASE_URL}/api/ratings`,
          {
            productId: id,
            userId,
            rating,
            description: feedback,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews([
          {
            User: { fullName: "User" },
            rating,
            description: feedback,
            createdAt: new Date().toISOString(),
          },
          ...reviews,
        ]);
        setProduct((prev) => ({
          ...prev,
          averageRatings: response.data.averageRatings || prev.averageRatings,
          totalReviews: response.data.totalReviews || prev.totalReviews,
        }));
        setShowModal(false);
        setRating(0);
        setFeedback("");
        toast.success("Review submitted successfully!");
      } catch (err) {
        toast.error("Failed to submit review.", err);
      }
    } else {
      toast.error("Please provide a rating and feedback.");
    }
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() => setRating(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className={`cursor-pointer text-3xl ${
          (hoverRating || rating) > i ? "text-[#393185]" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => {
      const newQuantity = prev + increment;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.originalQty)
        return product.originalQty;
      return newQuantity;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="py-12 px-2 md:px-4 lg:px-10 xl:px-8 container mx-auto">
      <div className="text-sm text-gray-500 mb-4">
        Home / Product /{" "}
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex flex-col gap-4 w-full lg:w-2/5">
          <div className="rounded-2xl">
            <img
              src={mainImage}
              alt={product.name}
              className="rounded-xl w-full object-contain"
              onError={(e) => {
                e.target.src = "/images/Product1.png";
              }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.isArray(product.images) && product.images.length > 0 ? (
              product.images.map((img, i) => {
                const imageUrl = `${USER_BASE_URL}/${img}`;
                return (
                  <img
                    key={i}
                    src={imageUrl}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-28 rounded-lg mx-1 cursor-pointer hover:shadow"
                    onClick={() => setMainImage(imageUrl)}
                    onError={(e) => {
                      e.target.src = "/images/Product1.png";
                    }}
                    loading="lazy"
                  />
                );
              })
            ) : (
              <div className="text-gray-500">
                No additional images available.
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-3/5 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">{product.name}</h2>

          <div className="flex items-center gap-1 text-[#393185]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                fill={
                  i < Math.round(product.averageRatings)
                    ? "currentColor"
                    : "none"
                }
                className={
                  i < Math.round(product.averageRatings) ? "" : "text-gray-800"
                }
              />
            ))}
            <span className="ml-2 text-gray-600">
              {product.totalReviews} Reviews
            </span>
          </div>

          <p className="text-xl md:text-3xl font-bold text-gray-800">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-lg md:text-xl text-gray-600">
            {product.shortDescription}
          </p>

          <ul className="text-gray-600 list-disc list-inside space-y-1">
            <li>Free shipping on orders over ₹1500</li>
            <li
              className={
                product.remainingQty === 0 ? "text-red-600" : "text-gray-600"
              }
            >
              {product.remainingQty === 0
                ? "Out of Stock"
                : `In stock: ${product.remainingQty} units`}
            </li>
          </ul>

          <div className="flex flex-col items-start gap-2">
            <span className="font-semibold text-lg md:text-xl">Quantity</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className="px-3 py-2 disabled:opacity-50 cursor-pointer"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border-l border-r"
              />
              <button
                className="px-3 py-2 disabled:opacity-50 cursor-pointer"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.originalQty}
              >
                +
              </button>
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`w-1/2 bg-[#393185] text-white px-4 py-2 md:py-3 rounded-md md:text-lg text-center ${
                product.remainingQty === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={product.remainingQty === 0}
            >
              Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className={`border border-[#393185] text-[#393185] px-4 py-2 md:py-3 rounded-md w-1/2 md:text-lg text-center ${
                product.remainingQty === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={product.remainingQty === 0}
            >
              Buy Now
            </button>
          </div>

          <ul className="md:text-lg text-gray-500 list-disc list-inside space-y-1 mt-4">
            {Array.isArray(product.features) && product.features.length > 0 ? (
              product.features.map((feature, i) => <li key={i}>{feature}</li>)
            ) : (
              <li>No features available.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex md:space-x-4 border-b border-gray-200 mb-4">
          <button
            className={`${tabClass("description")} text-sm md:text-lg`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`${tabClass("specification")} text-sm md:text-lg`}
            onClick={() => setActiveTab("specification")}
          >
            Specifications
          </button>
          <button
            className={`${tabClass("review")} text-sm md:text-lg`}
            onClick={() => setActiveTab("review")}
          >
            Reviews ({product.totalReviews})
          </button>
        </div>

        <div className="transition-opacity duration-300 ease-in-out md:text-lg">
          {activeTab === "description" && (
            <div>
              <p className="text-gray-700 py-3">{product.longDescription}</p>
              <div className="py-3">
                <span className="font-semibold text-xl">How to Use</span>
                <ol className="text-gray-700 list-decimal pl-4 mt-2">
                  {Array.isArray(product.howToUse) &&
                    product.howToUse.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>
              <div className="py-3">
                <span className="font-semibold text-xl">Suitable Surfaces</span>
                <p className="text-gray-700 py-3">{product.suitableSurfaces}</p>
              </div>
            </div>
          )}

          {activeTab === "specification" && (
            <div className="w-full">
              <div className="grid grid-cols-2 text-sm md:text-lg text-gray-500 border-gray-200">
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  Volume
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.volume || "N/A"}
                </div>
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  Ingredients
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.ingredients || "N/A"}
                </div>
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  Scent
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.scent || "N/A"}
                </div>
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  pH Level
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.phLevel || "N/A"}
                </div>
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  Shelf Life
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.shelfLife || "N/A"} months
                </div>
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  Made In
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.madeIn || "N/A"}
                </div>
                <div className="py-3 px-4 border-b border-gray-200 mr-4">
                  Packaging
                </div>
                <div className="py-3 px-4 border-b border-gray-200">
                  {product.packaging || "N/A"}
                </div>
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  className="bg-[#393185] text-white px-4 md:px-8 py-2 md:py-4 rounded cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  Write a Review
                </button>
              </div>

              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map((review, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <div className="font-semibold text-xl md:text-3xl">
                        {review.User?.fullName || "Anonymous"}
                      </div>
                      <div className="text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-[#393185] md:text-2xl">
                      {[...Array(5)].map((_, idx) => (
                        <span
                          key={idx}
                          className={
                            idx < Math.round(review.rating)
                              ? "text-[#393185]"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="md:text-xl text-gray-700 mt-1">
                      {review.description}
                    </p>
                    <hr className="border-t border-gray-200 mt-4" />
                  </div>
                ))
              ) : (
                <div>No reviews yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Write a Review</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-xl cursor-pointer hover:text-gray-800"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center mb-4">{renderStars()}</div>
            <textarea
              className="w-full border rounded p-2 h-24 mb-4"
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              onClick={handleSave}
              className="bg-[#393185] text-white w-full py-2 rounded cursor-pointer transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProductPage;
