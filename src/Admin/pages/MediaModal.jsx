import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { USER_BASE_URL } from "../../config";
import { toast } from "react-hot-toast";

const MediaModal = ({ isOpen, onClose, media, refreshMedia, token }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (media) {
      setImagePreview(media.imageUrl ? `${USER_BASE_URL}${media.imageUrl}` : null);
      setVideoPreview(media.videoUrl ? `${USER_BASE_URL}${media.videoUrl}` : null);
      setSelectedImage(null);
      setSelectedVideo(null);
      setRemoveVideo(false);
    } else {
      setImagePreview(null);
      setVideoPreview(null);
      setSelectedImage(null);
      setSelectedVideo(null);
      setRemoveVideo(false);
    }
  }, [media]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No image selected");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (e.g., JPG, PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No video selected");
      return;
    }
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (e.g., MP4, WebM)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Video size should be less than 5MB");
      return;
    }
    setSelectedVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    setRemoveVideo(false);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setRemoveVideo(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!media && !selectedImage) {
      toast.error("Please upload an image");
      setIsSubmitting(false);
      return;
    }

    if (media && !selectedImage && !selectedVideo && !removeVideo) {
      toast.error("Please upload a new image, video, or remove the video");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = media
        ? `${USER_BASE_URL}/api/media/${media.id}`
        : `${USER_BASE_URL}/api/media`;

      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (selectedVideo) {
        formData.append("video", selectedVideo);
      }
      if (removeVideo) {
        formData.append("removeVideo", "true");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (media) {
        await axios.put(endpoint, formData, { headers });
        toast.success("Media Updated");
      } else {
        await axios.post(endpoint, formData, { headers });
        toast.success("Media Added");
      }

      refreshMedia();
      onClose();
    } catch (error) {
      console.error("Error saving media:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong";
      toast.error(String(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (imagePreview && selectedImage) {
      URL.revokeObjectURL(imagePreview);
    }
    if (videoPreview && selectedVideo) {
      URL.revokeObjectURL(videoPreview);
    }
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview(null);
    setVideoPreview(null);
    setRemoveVideo(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {media ? "Edit Media" : "Add New Media"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image {media ? "(optional)" : "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
                required={!media}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-32 h-32 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video (optional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#393185]"
              />
              {videoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <video
                    src={videoPreview}
                    className="w-32 h-32 object-cover rounded-md"
                    controls
                    onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                  >
                    Your browser does not support the video.
                  </video>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-[#393185] hover:bg-[#2a2568]"
            >
              {isSubmitting ? "Saving..." : "Save Media"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaModal;