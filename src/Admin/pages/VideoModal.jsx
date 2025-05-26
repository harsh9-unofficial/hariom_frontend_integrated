import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const VideoModal = ({ isOpen, onClose, video, refreshVideos }) => {
  const token = localStorage.getItem("token");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (video) {
      setPreview(video.videoUrl); // Set preview for existing video
      setSelectedFile(null);
    } else {
      setPreview(null);
      setSelectedFile(null);
    }
  }, [video]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (video only)
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      // Validate video size (e.g., max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video size should be less than 50MB");
        return;
      }
      setSelectedFile(file);
      // Generate preview URL for the selected file
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate file selection for new videos
    if (!video && !selectedFile) {
      toast.error("Please upload a video");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = video
        ? `${USER_BASE_URL}/api/video/${video.id}`
        : `${USER_BASE_URL}/api/video`;

      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append("video", selectedFile); // Append video file
      }

      if (video) {
        // Update existing video
        await axios.put(endpoint, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Video Updated");
      } else {
        // Create new video
        await axios.post(endpoint, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Video Added");
      }

      refreshVideos();
      onClose();
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error(error.response?.data?.error || "Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URL to avoid memory leaks
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
            {video ? "Edit Video" : "Add New Video"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Video *
            </label>
            <input
              type="file"
              accept="video/*" // Allow only video files
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
              required={!video} // Required only for new videos
            />
            {/* Preview */}
            {preview && (
              <div className="mt-2">
                <video
                  src={
                    preview.startsWith("blob:")
                      ? preview
                      : `${USER_BASE_URL}${preview}`
                  }
                  controls
                  className="w-32 h-32 object-cover rounded-md"
                  onError={(e) => (e.target.poster = "/placeholder-video.jpg")} // Fallback thumbnail
                />
              </div>
            )}
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
              className="px-4 py-2 rounded-md text-white bg-[#393185] cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoModal;