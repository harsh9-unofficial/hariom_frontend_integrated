import { useState, useRef, useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HiPlay, HiPause } from "react-icons/hi2";
import { IoVolumeMuteOutline, IoVolumeHighOutline } from "react-icons/io5";

const posts = [
  { type: "video", src: "/InstaBlock.mp4" },
  { type: "image", src: "/images/InstaFeed.png" },
  { type: "video", src: "/InstaBlock.mp4" },
  { type: "image", src: "/images/InstaFeed.png" },
  { type: "video", src: "/InstaBlock.mp4" },
  { type: "image", src: "/images/InstaFeed.png" },
];

export default function InstagramFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [thumbnails, setThumbnails] = useState({});
  const videoRef = useRef(null);

  // Function to generate thumbnail from video
  const generateThumbnail = (videoSrc, index) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      video.src = videoSrc;
      video.muted = true;
      video.preload = "metadata"; // Preload metadata for faster loading

      // Ensure video is ready to capture the first frame
      video.addEventListener("loadeddata", () => {
        video.currentTime = 0; // Explicitly set to first frame
      });

      // Capture frame when seeking is complete
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

      // Handle errors
      video.addEventListener("error", () => {
        reject(new Error(`Failed to load video: ${videoSrc}`));
      });

      video.load();
    });
  };

  // Generate thumbnails for all video posts
  useEffect(() => {
    const videoPosts = posts.filter((post) => post.type === "video");
    Promise.all(
      videoPosts.map((post, index) =>
        generateThumbnail(post.src, posts.indexOf(post)).catch((error) => {
          console.error(error);
          return {
            index: posts.indexOf(post),
            thumbnailUrl: "/images/placeholder.png",
          }; // Fallback
        })
      )
    ).then((results) => {
      const thumbnailMap = results.reduce((acc, { index, thumbnailUrl }) => {
        acc[index] = thumbnailUrl;
        return acc;
      }, {});
      setThumbnails(thumbnailMap);
    });
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    setIsPlaying(true);
    setIsMuted(true);
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
        videoRef.current.play();
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
            onClick={() => openModal(post)}
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
