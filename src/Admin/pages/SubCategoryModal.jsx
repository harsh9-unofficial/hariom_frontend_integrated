import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { USER_BASE_URL } from "../../config";
import "react-datepicker/dist/react-datepicker.css";
import { XMarkIcon } from "@heroicons/react/24/outline";

const SubCategoryModal = ({
  isOpen,
  onClose,
  category,
  categories,
  getSubCategoryData,
}) => {
  const token = localStorage.getItem("token");

  const {
    watch,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const watchImage = watch("image");

  useEffect(() => {
    if (category) {
      setValue("sub_cate_name", category?.sub_cate_name);
      setValue("cate_id", category?.cate_id);
      setImagePreview(`${USER_BASE_URL}/uploads/${category?.image}`);
    } else {
      reset();
    }
  }, [category, setValue, reset]);

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);

      return () => URL.revokeObjectURL(previewURL);
    } else if (!category?.image) {
      setImagePreview(null);
    }
  }, [watchImage, category]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("sub_cate_name", data.sub_cate_name);
      formData.append("cate_id", data.cate_id);

      if (data.image[0]) {
        formData.append("image", data?.image[0]);
      }

      if (category) {
        await axios.put(
          `${USER_BASE_URL}/api/subcategory/update/${category?.sub_cate_id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("SubCategory Updated");
        reset();
      } else {
        await axios.post(`${USER_BASE_URL}/api/subcategory/add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("SubCategory Added");
        reset();
      }

      getSubCategoryData();
      onClose();
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast.error("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold">
            {category ? "Edit SubCategory" : "Add New SubCategory"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category *
              </label>
              <select
                {...register("cate_id", { required: "Category is required" })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
              >
                <option value="">-- Select --</option>
                {categories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>
                    {cat?.name}
                  </option>
                ))}
              </select>
              {errors.cate_id && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.cate_id.message}
                </p>
              )}
            </div>

            {/* SubCategory Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SubCategory Name *
              </label>
              <input
                type="text"
                placeholder="Enter SubCategory"
                {...register("sub_cate_name", {
                  required: "SubCategory name is required",
                  validate: (value) =>
                    value.trim() !== "" ||
                    "SubCategory name cannot be empty or spaces only",
                })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
              />
              {errors.sub_cate_name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.sub_cate_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SubCategory Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", {
                validate: (fileList) => {
                  if (!category && (!fileList || fileList.length === 0)) {
                    return "Image is required";
                  }
                  return true;
                },
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
            />
            {errors.image && (
              <p className="text-sm text-red-600 mt-1">
                {errors.image.message}
              </p>
            )}

            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-[#393185] cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save SubCategory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryModal;
