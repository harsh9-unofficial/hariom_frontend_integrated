import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaInstagram } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HiPlay, HiPause } from "react-icons/hi2";
import { IoVolumeMuteOutline, IoVolumeHighOutline } from "react-icons/io5";
import { USER_BASE_URL } from "../config";

export default function InstagramFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [thumbnails, setThumbnails] = useState({});
  const [posts, setPosts] = useState([]);
  const videoRef = useRef(null);

  const generateThumbnail = (videoSrc, index) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      video.src = videoSrc;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.preload = "metadata";

      video.addEventListener("loadeddata", () => {
        video.currentTime = 0;
      });

      video.addEventListener("seeked", () => {
        try {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/png");
          resolve({ index, thumbnailUrl });
        } catch (error) {
          reject(error);
        }
      });

      video.addEventListener("error", () => {
        reject(new Error(`Failed to load video: ${videoSrc}`));
      });

      video.load();
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [imageResponse, videoResponse] = await Promise.all([
          axios.get(`${USER_BASE_URL}/api/instasection`),
          axios.get(`${USER_BASE_URL}/api/video`),
        ]);

        const imagePosts = Array.isArray(imageResponse.data)
          ? imageResponse.data.map((item) => ({
              type: "image",
              src: `${USER_BASE_URL}${item.imageUrl}`,
            }))
          : [];
        const videoPosts = Array.isArray(videoResponse.data)
          ? videoResponse.data.map((item) => ({
              type: "video",
              src: `${USER_BASE_URL}${item.videoUrl}`,
            }))
          : [];

        // Alternate image and video posts
        const combinedPosts = [];
        const maxLength = Math.max(imagePosts.length, videoPosts.length);
        for (let i = 0; i < maxLength; i++) {
          if (i < imagePosts.length) {
            combinedPosts.push(imagePosts[i]);
          }
          if (i < videoPosts.length) {
            combinedPosts.push(videoPosts[i]);
          }
        }

        setPosts(combinedPosts);

        const videoPostIndices = combinedPosts
          .map((post, index) => (post.type === "video" ? index : -1))
          .filter((index) => index !== -1);

        Promise.all(
          videoPostIndices.map((index) =>
            generateThumbnail(combinedPosts[index].src, index).catch((error) => {
              console.error(`Failed to generate thumbnail for video at index ${index}:`, error);
              return {
                index,
                thumbnailUrl: "/images/placeholder.png",
              };
            })
          )
        ).then((results) => {
          const thumbnailMap = results.reduce((acc, { index, thumbnailUrl }) => {
            acc[index] = thumbnailUrl;
            return acc;
          }, {});
          setThumbnails(thumbnailMap);
        });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    if (post.type === "video") {
      setIsPlaying(true);
      setIsMuted(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-12 container mx-auto text-center px-2 md:px-4 lg:px-10 xl:px-8">
      <h2 className="text-4xl font-semibold mb-1">Follow Us on Instagram</h2>
      <p className="text-xl text-gray-500 mb-8">@hariomchemical</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 mb-10">
        {posts.map((post, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-xl shadow cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={
                post.type === "video"
                  ? thumbnails[index] || "/images/placeholder.png"
                  : post.src
              }
              alt={`Instagram post ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {post.type === "video" ? (
                <HiPlay className="text-white w-8 h-8" />
              ) : (
                <FaInstagram className="text-white w-8 h-8" />
              )}
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://instagram.com/hariomchemical"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#393185] text-white text-sm px-20 py-3 rounded-md"
      >
        View Instagram
      </a>

      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            onClick={closeModal}
            className="fixed top-4 right-4 text-white text-xl cursor-pointer z-60"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          <div className="rounded-lg max-w-md w-full relative">
            {selectedPost.type === "video" ? (
              <>
                <video
                  ref={videoRef}
                  src={selectedPost.src}
                  alt="Enlarged Instagram video"
                  className="w-full h-auto object-contain rounded-lg"
                  autoPlay
                  muted={isMuted}
                />
                <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
                  <button
                    onClick={toggleMuteUnmute}
                    className="bg-black/60 rounded-full p-2 hover:bg-black/80 transition cursor-pointer"
                  >
                    {isMuted ? (
                      <IoVolumeMuteOutline className="h-5 w-5 text-white" />
                    ) : (
                      <IoVolumeHighOutline className="h-5 w-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="bg-black/60 rounded-full p-2 hover:bg-black/80 transition cursor-pointer"
                  >
                    {isPlaying ? (
                      <HiPause className="h-6 w-6 text-white" />
                    ) : (
                      <HiPlay className="h-6 w-6 text-white" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <img
                src={selectedPost.src}
                alt="Enlarged Instagram post"
                className="w-full h-auto object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}