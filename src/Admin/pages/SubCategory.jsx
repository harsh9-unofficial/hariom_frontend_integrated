import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import SubCategoryModal from "./SubCategoryModal";
import { FaSearch } from "react-icons/fa";

const SubCategory = () => {
  const token = localStorage.getItem("token");

  const perPage = 10;

  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilter, setIsFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subCateData, setSubCateData] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const totalPages = Math.ceil(totalCount / perPage);

  const getCategoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/api/category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubCategoryData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_BASE_URL}/api/subcategory/get`,
        {
          page: data?.page ? data?.page : currentPage,
          perPage: data?.perPage ? data?.perPage : perPage,
          search: searchTerm?.trim(),
        }
      );
      setSubCateData(response?.data?.category);
      setTotalCount(response?.data?.totalCategory);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
      setIsFilter(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    getSubCategoryData();
  }, [currentPage]);

  const handleDelete = async (sub_cate_id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(
          `${USER_BASE_URL}/api/subcategory/delete/${sub_cate_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getSubCategoryData();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage SubCategory</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 flex-grow">
            <input
              type="text"
              placeholder="Search subcategories..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#393185]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setIsFilter(true);
              }}
            />
            <button
              onClick={() => {
                isFilter && getSubCategoryData();
              }}
              className="text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto border border-black"
            >
              <FaSearch color="black" size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentData(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#393185] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add SubCategory</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No SubCategory Found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SubCategory Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subCateData?.map((subCate, index) => (
                  <tr key={subCate.sub_cate_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-500">
                        {(currentPage - 1) * perPage + index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-500">
                        {subCate?.Category?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subCate?.sub_cate_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subCate?.image ? (
                        <img
                          src={`${USER_BASE_URL}/uploads/${subCate.image}`}
                          alt="SubCategory"
                          className="h-12 w-12 object-cover rounded cursor-pointer border"
                          onClick={() => {
                            setSelectedImage(
                              `${USER_BASE_URL}/uploads/${subCate.image}`
                            );
                            setShowImageModal(true);
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentData({
                              ...subCate,
                            });
                            setIsModalOpen(true);
                          }}
                          className="text-[#393185] cursor-pointer"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(subCate.sub_cate_id)}
                          className="text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {showImageModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white p-4 rounded shadow-lg max-w-full max-h-full relative">
                      <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-black"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                      <img
                        src={selectedImage}
                        alt="Full Preview"
                        className="max-w-full max-h-[80vh] object-contain"
                      />
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      <SubCategoryModal
        isOpen={isModalOpen}
        category={currentData}
        categories={categories}
        getSubCategoryData={getSubCategoryData}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SubCategory;
