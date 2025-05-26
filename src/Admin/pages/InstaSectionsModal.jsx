import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const InstaSectionModal = ({ isOpen, onClose, section, refreshSections }) => {
  const token = localStorage.getItem("token");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("Section prop:", section); // Debug
    if (section && typeof section.imageUrl === "string") {
      setPreview(section.imageUrl);
      setSelectedFile(null);
    } else {
      setPreview(null);
      setSelectedFile(null);
    }
  }, [section]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    if (!file.type || typeof file.type !== "string" || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!section && !selectedFile) {
      toast.error("Please upload an image");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = section
        ? `${USER_BASE_URL}/api/instasection/${section?.id || ""}`
        : `${USER_BASE_URL}/api/instasection`;

      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      if (section) {
        await axios.put(endpoint, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Section Updated");
      } else {
        await axios.post(endpoint, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Section Added");
      }

      refreshSections();
      onClose();
    } catch (error) {
      console.error("Error saving section:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong";
      toast.error(String(errorMessage));
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview && selectedFile) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, selectedFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {section ? "Edit Section" : "Add New Section"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
                required={!section}
              />
              {preview && typeof preview === "string" && (
                <div className="mt-2">
                  <img
                    src={
                      preview.startsWith("blob:")
                        ? preview
                        : `${USER_BASE_URL}${preview}`
                    }
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-[#393185]"
            >
              {isSubmitting ? "Saving..." : "Save Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstaSectionModal;