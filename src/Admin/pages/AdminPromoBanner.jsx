import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import AdminPromoBannerModal from "./AdminPromoBannerModal";
import { USER_BASE_URL } from "../../config";

const AdminPromoBanner = () => {
  const token = localStorage.getItem("token");

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/api/promo-banners`);
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/api/promo-banners/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };

  // Filter banners based on search term
  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Disable Add button if a banner exists
  const isAddButtonDisabled = banners.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Promo Banners</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search banners..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#393185]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              if (!isAddButtonDisabled) {
                setCurrentBanner(null);
                setIsModalOpen(true);
              }
            }}
            disabled={isAddButtonDisabled}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isAddButtonDisabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#393185] text-white cursor-pointer"
            }`}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Promo Banner</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No banners found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1  gap-4">
          {filteredBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col min-h-fit"
            >
              <div className="relative overflow-hidden bg-gray-100">
                {banner.imageUrl ? (
                  <img
                    src={`${USER_BASE_URL}${banner.imageUrl}`}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentBanner(banner);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white rounded-full shadow text-[#393185] hover:bg-indigo-50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {banner.title || "Untitled"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {banner.description}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Button Text:</span>{" "}
                    {banner.buttonText || "Shop Deals"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminPromoBannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={currentBanner}
        refreshBanners={fetchBanners}
      />
    </div>
  );
};

export default AdminPromoBanner;