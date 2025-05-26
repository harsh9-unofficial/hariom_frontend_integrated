import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_BASE_URL } from "../config";

const CheckoutPage = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // List of Indian states and union territories
  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Get cart items or direct product from location state
  const { cartItems } = location.state || { cartItems: [] };
  const directProduct = location.state?.product || null;
  const finalCartItems = directProduct ? [{ ...directProduct }] : cartItems;

  console.log("finalCartItems", finalCartItems);

  // Calculate subtotal dynamically based on finalCartItems
  const subtotal = finalCartItems.reduce((acc, item) => {
    const product = item.Product || item;
    return acc + (product.price || 0) * (item.quantity || 1);
  }, 0);

  // Free shipping for subtotal > ₹1500, otherwise ₹20 for non-empty carts
  const shipping = finalCartItems.length > 0 && subtotal <= 1500 ? 20 : 0;
  const tax = finalCartItems.length > 0 ? 20 : 0; // Flat tax, 0 if no items
  const total = (subtotal + shipping + tax).toFixed(2);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "apt",
      "city",
      "state",
      "postalCode",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (formData.state === "Select State") {
      newErrors.state = "Please select a valid state";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Place Order button click
  const handlePlaceOrder = async () => {
    if (!userId || !token) {
      toast.error("Please login to place the order.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (finalCartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);

    const orderItems = finalCartItems
      .map((item) => {
        const product = item.Product || item;
        const productId = product.id || product.productId || item.productId;
        if (!productId) {
          console.warn("Missing productId for item:", item);
          return null;
        }
        return {
          productId,
          quantity: item.quantity || 1,
          price: product.price || 0,
        };
      })
      .filter((item) => item !== null);

    if (orderItems.length === 0) {
      toast.error("No valid items in the cart.");
      setLoading(false);
      return;
    }

    const payload = {
      userId,
      shippingCharge: shipping,
      tax,
      totalPrice: parseFloat(total),
      paymentMethod,
      status: 1,
      orderItems,
      ...formData, // Spread formData directly
    };

    console.log("Order Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/api/order/create`,
        payload
      );
      toast.success(response.data.message || "Order placed successfully!");
      setTimeout(() => {
        navigate("/track-order", {
          state: { order: response.data.order },
        });
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      toast.error(
        error.response?.data?.details ||
          error.response?.data?.error ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-10 xl:px-8 py-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
        Check Out
      </h2>
      <p className="text-lg md:text-xl text-gray-500 mb-6">Home / Check Out</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - Contact, Address, Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 border-t border-gray-300 pt-6">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                name="apt"
                value={formData.apt}
                onChange={handleInputChange}
                placeholder="Apartment, suite, etc."
                className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                  errors.apt ? "border-red-500" : ""
                }`}
              />
              {errors.apt && (
                <p className="text-red-500 text-sm mt-1">{errors.apt}</p>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your City"
                  className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.city ? "border-red-500" : ""
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`input border border-gray-300 text-gray-500 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.state ? "border-red-500" : ""
                  }`}
                >
                  <option value="Select State">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">ZIP Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP Code"
                  className={`input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185] ${
                    errors.postalCode ? "border-red-500" : ""
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6 border-t border-gray-300 pt-6">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <div className="space-y-4">
              {/* Credit/Debit Card option */}
              <label
                className={`flex items-center gap-2 border border-gray-300 p-3 ${
                  paymentMethod === "card" ? "text-black" : "text-gray-500"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-black"
                />
                <span>Credit/Debit Card</span>
              </label>

              {paymentMethod === "card" && (
                <div className="grid md:grid-cols-2 gap-4 px-4 border border-gray-300 p-3">
                  <div className="md:col-span-2 flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000"
                      className="input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">CVC</label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="input border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
                    />
                  </div>
                </div>
              )}

              {/* Online Payment option */}
              <label
                className={`flex items-center gap-2 border border-gray-300 p-3 ${
                  paymentMethod === "online" ? "text-black" : "text-gray-500"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="accent-black"
                />
                <span>Online payment</span>
              </label>

              {/* Cash on Delivery option */}
              <label
                className={`flex items-center gap-2 border border-gray-300 p-3 ${
                  paymentMethod === "cod" ? "text-black" : "text-gray-500"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-black"
                />
                <span>Cash on delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Order Summary */}
        <div className="border border-gray-300 p-3 rounded-lg h-fit bg-white">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            {finalCartItems?.map((item) => {
              const product = item.Product || item;
              return (
                <div
                  key={item.productId || item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        product.images
                          ? (() => {
                              try {
                                const imagesArray =
                                  typeof product.images === "string"
                                    ? JSON.parse(product.images)
                                    : product.images;
                                return imagesArray[0]
                                  ? `${USER_BASE_URL}/${imagesArray[0]}`
                                  : "/images/Product9.png";
                              } catch (e) {
                                console.error("Error parsing images:", e);
                                return "/images/Product9.png";
                              }
                            })()
                          : "/images/Product9.png"
                      }
                      className="w-14 h-14 rounded-md"
                      alt={product.name}
                    />
                    <div>
                      <p className="text-md font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-md font-medium">
                    ₹{(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
            <div className="border-t border-gray-300 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 && subtotal > 1500
                    ? "00.00"
                    : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-300 pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full bg-[#393185] text-white py-2 rounded-md mt-3 text-lg transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            <p className="text-sm text-gray-500 text-center mt-2 w-[62%] mx-auto">
              By placing your order, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
