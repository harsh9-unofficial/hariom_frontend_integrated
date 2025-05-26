import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import VideoModal from "./VideoModal"; // Updated modal component for videos
import { USER_BASE_URL } from "../../config";

const Videos = () => {
  const token = localStorage.getItem("token");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_BASE_URL}/api/video`);
      console.log(response.data);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`${USER_BASE_URL}/api/video/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  // Filter videos based on search term (e.g., by video ID or another field if needed)
  const filteredVideos = videos.filter((video) =>
    video.id.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Videos for Instagram Section
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          
          <button
            onClick={() => {
              setCurrentVideo(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#393185] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No videos found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-64 overflow-hidden">
                {/* Display video thumbnail or fallback image */}
                <video
                  src={`${USER_BASE_URL}${video.videoUrl}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.poster = "/placeholder-video.jpg")} // Fallback thumbnail
                  muted
                  preload="metadata"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentVideo(video);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white rounded-full shadow text-[#393185] hover:bg-[#d4cfff] cursor-pointer"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
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

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={currentVideo}
        refreshVideos={fetchVideos}
      />
    </div>
  );
};

export default Videos;
