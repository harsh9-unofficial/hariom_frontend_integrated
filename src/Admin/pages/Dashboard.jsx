import React, { useState, useEffect } from "react";
import {
  Star,
  Receipt,
  ListTree,
  ShoppingBag,
  MessageCircle,
  Users,
} from "lucide-react";
import axios from "axios";
import {
  CogIcon,
  InboxIcon,
  PhoneIcon,
  CalendarIcon,
  BookOpenIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { USER_BASE_URL } from "../../config";

const Dashboard = () => {
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const token = getAuthToken();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    subcat: 0,
    users: 0,
    contacts: 0,
    ratings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    if (!token) {
      alert("No authentication token found. Please log in.");
      window.location.href = "/login";
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // Fetch dashboard stats
      const statsResponse = await axios.get(
        `${USER_BASE_URL}/api/products/dashboardcounter`,
        { headers }
      );

      // Fetch recent users (assuming an endpoint like /api/users exists)
      const usersResponse = await axios.get(
        `${USER_BASE_URL}/api/users/profile`,
        {
          headers,
        }
      );

      setStats({
        products: statsResponse.data.products,
        orders: statsResponse.data.orders,
        categories: statsResponse.data.category,
        subcat: statsResponse.data.subcat,
        users: statsResponse.data.users,
        contacts: statsResponse.data.contact,
        ratings: statsResponse.data.reviews,
      });

      const sortedUsers = [...(usersResponse.data || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        alert("Authentication error. Please log in again.");
        window.location.href = "/login";
      } else {
        console.error("Error fetching dashboard data:", error);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statsData = [
    {
      name: "Categories",
      value: stats.categories,
      icon: BookOpenIcon,
      color: "bg-red-100 text-red-600",
    },
    {
      name: "SubCategory",
      value: stats.subcat,
      icon: ListBulletIcon,
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Products",
      value: stats.products,
      icon: ShoppingBagIcon,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Orders",
      value: stats.orders,
      icon: CogIcon,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Users",
      value: stats.users,
      icon: InboxIcon,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      name: "Contacts",
      value: stats.contacts,
      icon: PhoneIcon,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Reviews",
      value: stats.ratings,
      icon: Star,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 text-center">
            Last updated: {lastUpdated}
          </span>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className={`p-2 rounded-full ${
              loading ? "bg-gray-100" : "bg-gray-200 hover:bg-gray-300"
            }`}
            title="Refresh data"
          >
            <ArrowPathIcon
              className={`h-5 w-5 text-gray-600 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {statsData.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {loading ? "--" : stat.value}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Users
            </h3>
            <span className="text-sm text-gray-500">Last 5 users</span>
          </div>
          <div className="bg-white overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <li
                      key={user.id}
                      className="px-4 py-4 sm:px-6 hover:bg-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {user.name || "User"}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : user.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.status || "active"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex items-center">
                          <Users className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">
                            {user.username || "N/A"}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <CalendarIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <EnvelopeIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                        <a
                          href={`mailto:${user.email}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {user.email || "N/A"}
                        </a>
                        <PhoneIcon className="flex-shrink-0 h-4 w-4 text-gray-400 ml-3 mr-1" />
                        <a
                          href={`tel:${user.phone}`}
                          className="text-xs text-gray-600"
                        >
                          {user.phone || "N/A"}
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No recent users</p>
                  </div>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link
                to="/admin/categories"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <ListTree className="h-5 w-5 text-green-600 mr-3" />
                  <span>Manage Categories</span>
                </div>
              </Link>
              <Link
                to="/admin/subcategory"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <ListBulletIcon className="h-5 w-5 text-orange-500 mr-3" />
                  <span>Manage SubCategory</span>
                </div>
              </Link>
              <Link
                to="/admin/products"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>Manage Products</span>
                </div>
              </Link>
              <Link
                to="/admin/users"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-red-600 mr-3" />
                  <span>Manage Users</span>
                </div>
              </Link>
              <Link
                to="/admin/ratings"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-600 mr-3" />
                  <span>View Reviews</span>
                </div>
              </Link>
              <Link
                to="/admin/contact"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-pink-600 mr-3" />
                  <span>View Contacts</span>
                </div>
              </Link>
              <Link
                to="/admin/orders"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Receipt className="h-5 w-5 text-yellow-600 mr-3" />
                  <span>View Orders</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
