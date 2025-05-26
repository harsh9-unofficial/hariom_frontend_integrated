import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import MediaModal from "./MediaModal";
import { USER_BASE_URL } from "../../config";

const Media = () => {
  const token = localStorage.getItem("token");

  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/api/media`);
      setMediaItems(response.data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this media?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/api/media/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchMedia();
      } catch (error) {
        console.error("Error deleting media:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Media
        </h1>

        <button
          onClick={() => {
            setCurrentMedia(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#393185] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Media</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No media found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {mediaItems.map((media) => (
            <div
              key={media.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-64 overflow-hidden">
                {media.videoUrl ? (
                  <video
                    src={`${USER_BASE_URL}${media.videoUrl}`}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    controls={false}
                    onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                  >
                    Your browser does not support the video.
                  </video>
                ) : (
                  <img
                    src={`${USER_BASE_URL}${media.imageUrl}`}
                    alt="Media content"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                )}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentMedia(media);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white rounded-full shadow text-[#393185] hover:bg-[#d4cfff] cursor-pointer"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(media.id)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={currentMedia}
        refreshMedia={fetchMedia}
        token={token}
      />
    </div>
  );
};

export default Media;