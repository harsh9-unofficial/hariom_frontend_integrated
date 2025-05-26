import React, { useEffect, useState } from "react";
import {
  User,
  ClipboardList,
  Trash2,
  LogOut,
  X,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const TrackOrderPage = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(false);
  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    phone: "",
    email: "",
  });
  const [originalUserData, setOriginalUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab !== "history") {
      setSelectedOrder(null);
    }
  };

  const isActive = (tab) =>
    activeTab === tab
      ? "bg-[#393185] text-white font-medium"
      : "hover:bg-gray-100 text-black";

  const getProductImage = (images) => {
    try {
      const imageArray = Array.isArray(images)
        ? images
        : JSON.parse(images || "[]");
      return imageArray[0]
        ? `${USER_BASE_URL}/${imageArray[0]}`
        : "/images/Product9.png";
    } catch (e) {
      console.error("Error parsing images:", e);
      return "/images/Product9.png";
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, orderResponse] = await Promise.all([
          axios.get(`${USER_BASE_URL}/api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${USER_BASE_URL}/api/order/getuserorder/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedUserData = {
          fullname: userResponse.data.user.fullname || "",
          username: userResponse.data.user.username || "",
          phone: userResponse.data.user.phone || "",
          email: userResponse.data.user.email || "",
        };

        console.log("API User Response:", userResponse.data.user); // Debug API response

        setUserData(fetchedUserData);
        setOriginalUserData(fetchedUserData);
        setOrders(orderResponse.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load data.");
      }
    };

    fetchData();
  }, [userId, token, navigate]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `${USER_BASE_URL}/api/order/get/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOrder(response.data);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      toast.error("Failed to load order details.");
    }
  };

  const handleFormUpdate = async () => {
    if (!isFormEditable) {
      setIsFormEditable(true);
      return;
    }

    const updatedData = {
      fullname: userData.fullname,
      username: userData.username,
      phone: userData.phone,
      email: userData.email,
    };

    try {
      const response = await axios.patch(
        `${USER_BASE_URL}/api/users/profile/${userId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully.");
      setIsFormEditable(false);
      setOriginalUserData(userData);

      const updatedUserData = {
        fullname: response.data.user.fullname || "",
        username: response.data.user.username || "",
        phone: response.data.user.phone || "",
        email: response.data.user.email || "",
      };
      setUserData(updatedUserData);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${USER_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      toast.success("Account deleted successfully.");
      setShowModal(false);
      navigate("/signup");
    } catch (err) {
      toast.error("Failed to delete account.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully.");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const statusSteps = [
    { id: 1, name: "Ordered", status: 1 },
    { id: 2, name: "Shipping", status: 2 },
    { id: 3, name: "Out for Delivery", status: 3 },
    { id: 4, name: "Delivered", status: 4 },
  ];

  const currentStep = selectedOrder
    ? statusSteps.find((step) => step.status === selectedOrder.status)?.id || 1
    : 1;

  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-10 xl:px-8 py-12">
      <h1 className="text-2xl font-semibold mb-1">Track Your Order</h1>
      <p className="text-gray-500 mb-6">Home / Track Your Order</p>

      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="w-full md:w-1/3 lg:w-3/10 h-fit border border-gray-400 rounded-xl p-4 lg:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/image.png"
              alt="Profile"
              className="w-18 h-18 rounded-full"
            />
            <h2 className="font-medium text-2xl">Hi, {userData.fullname}</h2>
          </div>

          <div className="w-full space-y-1">
            <button
              onClick={() => handleTabClick("profile")}
              className={`flex items-center gap-6 w-full text-gray-500 px-5 py-3 rounded-md transition cursor-pointer ${isActive(
                "profile"
              )}`}
            >
              <User size={18} />
              My Profile
            </button>
            <button
              onClick={() => handleTabClick("history")}
              className={`flex items-center gap-6 w-full text-gray-500 px-5 py-3 rounded-md transition cursor-pointer ${isActive(
                "history"
              )}`}
            >
              <ClipboardList size={18} />
              Order History
            </button>
            <button
              onClick={() => handleTabClick("delete")}
              className={`flex items-center gap-6 w-full text-gray-500 px-5 py-3 rounded-md transition cursor-pointer ${isActive(
                "delete"
              )}`}
            >
              <Trash2 size={18} />
              Delete Account
            </button>
            <button
              onClick={() => handleTabClick("logout")}
              className={`flex items-center gap-6 w-full text-gray-500 px-5 py-3 rounded-md transition cursor-pointer ${isActive(
                "logout"
              )}`}
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/3 lg:w-7/10 border border-gray-400 rounded-xl py-5 lg:py-10 px-3 md:px-4 lg:px-8 h-fit">
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Full Name</label>
                <input
                  type="text"
                  value={userData.fullname}
                  onChange={(e) =>
                    setUserData({ ...userData, fullname: e.target.value })
                  }
                  readOnly={!isFormEditable}
                  className={`w-full border border-gray-400 rounded-md py-3 px-4 ${
                    isFormEditable ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  readOnly={!isFormEditable}
                  className={`w-full border border-gray-400 rounded-md py-3 px-4 ${
                    isFormEditable ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  readOnly={!isFormEditable}
                  className={`w-full border border-gray-400 rounded-md py-3 px-4 ${
                    isFormEditable ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              <div className="relative">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  readOnly={!isFormEditable}
                  className={`w-full border border-gray-400 rounded-md py-3 px-4 ${
                    isFormEditable ? "bg-white" : "bg-gray-100"
                  } text-gray-600`}
                />
              </div>
              <div className="flex items-end text-right">
                <button
                  onClick={handleFormUpdate}
                  className="bg-[#393185] text-white px-4 py-3 rounded-md cursor-pointer h-fit transition"
                >
                  {isFormEditable ? "Save" : "Update"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Order History</h3>
              {selectedOrder ? (
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-[#393185] mb-4 hover:underline cursor-pointer"
                    aria-label="Back to order list"
                  >
                    <ArrowLeft size={18} />
                    Back to Orders
                  </button>

                  <div className="relative flex justify-between items-center mb-10 md:px-4">
                    <div className="absolute top-4 left-[calc(12.5%+6px)] right-[calc(12.5%+6px)] h-0.5 bg-gray-300 z-0"></div>
                    <div
                      className="absolute top-4 left-[calc(12.5%+2px)] h-0.5 bg-[#393185] z-10 transition-all duration-500"
                      style={{ width: `calc(25% * ${currentStep - 1})` }}
                    ></div>
                    {statusSteps.map((step, index) => {
                      const stepNumber = index + 1;
                      const isCompleted = stepNumber < currentStep;
                      const isCurrent = stepNumber === currentStep;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center relative z-20 w-1/4"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors duration-300 ${
                              isCompleted || isCurrent
                                ? "bg-[#393185] text-white border-[#393185]"
                                : "bg-white text-gray-400 border-gray-300"
                            }`}
                          >
                            {isCompleted || isCurrent ? "✓" : stepNumber}
                          </div>
                          <p className="text-sm mt-2 text-center">
                            {step.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-400 rounded-md p-4">
                      <h4 className="font-medium">
                        Delivery by Hariom Chemicals
                      </h4>
                      <p className="text-sm text-gray-500">
                        Tracking ID: {selectedOrder.id || "N/A"}
                      </p>
                    </div>
                    <div className="border border-gray-400 rounded-md p-4">
                      <h4 className="font-medium">Shipping Address</h4>
                      <p className="text-sm text-gray-500">
                        {selectedOrder.address || "N/A"},{" "}
                        {selectedOrder.city || "N/A"},{" "}
                        {selectedOrder.state || "N/A"}{" "}
                        {selectedOrder.postalCode || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <img
                      src={getProductImage(
                        selectedOrder.OrderItems?.[0]?.Product?.images
                      )}
                      alt={
                        selectedOrder.OrderItems?.[0]?.Product?.name ||
                        "Product"
                      }
                      className="rounded-2xl shadow w-full md:w-[49%] object-contain"
                    />
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-2 cursor-pointer hover:shadow-lg"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <img
                        src={getProductImage(
                          order.OrderItems?.[0]?.Product?.images
                        )}
                        alt={order.OrderItems?.[0]?.Product?.name || "Product"}
                        className="w-full h-57 object-contain rounded-t-lg"
                      />
                      <div className="p-2">
                        <p className="font-medium">
                          Order #{order.id} -{" "}
                          {order.OrderItems?.[0]?.Product?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: ₹{order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "delete" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
              <p className="text-red-500">This action is irreversible.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Delete My Account
              </button>
            </div>
          )}

          {activeTab === "logout" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Log Out</h3>
              <p>Are you sure you want to log out?</p>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="mt-4 bg-[#393185] text-white px-4 py-2 rounded cursor-pointer"
              >
                Confirm Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="delete-modal-title"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 id="delete-modal-title" className="text-lg font-semibold">
                Confirm Delete
              </h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close delete modal"
              >
                <X className="w-5 h-5 text-gray-600 cursor-pointer" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="logout-modal-title"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 id="logout-modal-title" className="text-lg font-semibold">
                Confirm Logout
              </h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                aria-label="Close logout modal"
              >
                <X className="w-5 h-5 text-gray-600 cursor-pointer" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-[#393185] text-white rounded cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
