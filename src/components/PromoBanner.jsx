import { useState, useEffect } from "react";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { Link } from "react-router-dom";

export default function PromoBanner() {
  // State to store API data with fallback values
  const [promoData, setPromoData] = useState({
    backgroundImage: "/images/PromoBanner.png", // Fallback image
    title: "Spring Cleaning Sale!", // Fallback title
    description: "Get 20% off on all cleaning bundles. Limited time offer.", // Fallback description
    buttonText: "Shop Deals", // Fallback button text
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API using Axios
  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await axios.get(`${USER_BASE_URL}/api/promo-banners`);
        // Assuming the API returns an array, use the first banner if available
        const banner = response.data.length > 0 ? response.data[0] : null;
        if (banner) {
          setPromoData({
            backgroundImage: banner.imageUrl
              ? `${USER_BASE_URL}${banner.imageUrl}` // Prepend base URL to imageUrl
              : promoData.backgroundImage,
            title: banner.title || promoData.title,
            description: banner.description || promoData.description,
            buttonText: banner.buttonText || promoData.buttonText,
          });
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch promo data");
        setLoading(false);
      }
    };

    fetchPromoData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <section className="container mx-auto py-8 px-2 md:px-4 lg:px-10 xl:px-8">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  // Render error state with fallback banner
  if (error) {
    return (
      <section className="container mx-auto py-8 px-2 md:px-4 lg:px-10 xl:px-8">
        <div
          className="relative rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 md:p-10 lg:p-12 text-white h-[250px] md:h-[380px] lg:h-[435px] xl:h-[550px]"
          style={{
            backgroundImage: `url(${promoData.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="z-10 md:w-sm text-left mb-6 md:mb-0 bg-opacity-50 py-6 xl:ml-6 rounded-lg lg:w-full">
            <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-3">
              {promoData.title}
            </h2>
            <p className="text-base md:text-lg xl:text-xl mb-5">
              {promoData.description}
            </p>
            <button className="bg-white text-black text-sm sm:text-base font-medium px-5 py-2 rounded cursor-pointer transition">
              {promoData.buttonText}
            </button>
          </div>
        </div>
        <div className="text-center text-red-500 mt-4">{error}</div>
      </section>
    );
  }

  // Main render
  return (
    <section className="container mx-auto py-8 px-2 md:px-4 lg:px-10 xl:px-8">
      <div
        className="relative rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 md:p-10 lg:p-12 text-white h-[250px] md:h-[380px] lg:h-[435px] xl:h-[550px]"
        style={{
          backgroundImage: `url(${promoData.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Text Content */}
        <div className="z-10 md:w-sm text-left bg-opacity-50 py-6 xl:ml-6 rounded-lg lg:w-full">
          <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-3">
            {promoData.title}
          </h2>
          <p className="text-base md:text-lg xl:text-xl mb-5">
            {promoData.description}
          </p>
          <Link to="/products">
            <button className="bg-white text-black text-sm sm:text-base font-medium px-5 py-2 rounded cursor-pointer transition">
              {promoData.buttonText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
