import React from "react";
import Header from "./Header";
import InstagramFeed from "./InstagramFeed";

const coreValues = [
  {
    icon: "/images/CoreValue1.png",
    title: "Quality First",
    description:
      "We are committed to delivering top-quality cleaning products that ensure safety, effectiveness, and satisfaction in every use.",
    color: "bg-[#78BEFF]",
    text: "text-[#5593FF]",
  },
  {
    icon: "/images/CoreValue2.png",
    title: "Innovation",
    description:
      "We constantly evolve and innovate our formulas and processes to provide cutting-edge solutions that meet changing customer needs.",
    color: "bg-[#FFBFB5]",
    text: "text-[#FF7F55]",
  },
  {
    icon: "/images/CoreValue3.png",
    title: "Customer-Centricity",
    description:
      "Our customers are at the heart of everything we do. We listen, respond, and strive to exceed their expectations with reliable products and support.",
    color: "bg-[#B2A7F8]",
    text: "text-[#A649F3]",
  },
  {
    icon: "/images/CoreValue4.png",
    title: "Sustainability",
    description:
      "We believe in protecting the environment. Our practices and products are designed to minimize waste and promote eco-friendly cleaning.",
    color: "bg-[#A8FA9B]",
    text: "text-[#49F349]",
  },
  {
    icon: "/images/CoreValue5.png",
    title: "Consistency",
    description:
      "From the first drop to the last, our products reflect consistent performance and dependable results.",
    color: "bg-[#FFD23F]",
    text: "text-[#F3CB49]",
  },
  {
    icon: "/images/CoreValue6.png",
    title: "Growth & Excellence",
    description:
      "We aim for continuous growth by setting high standards, embracing challenges, and pushing boundaries to achieve excellence.",
    color: "bg-[#FF8551]",
    text: "text-[#F38449]",
  },
];

const AboutUsPage = () => {
  return (
    <>
      <div
        className="relative w-full h-[400px] md:h-[475px] lg:h-[600px]"
        style={{
          backgroundImage: "url(/images/PromoBanner1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Header - must be above the overlay */}
        <div className="relative z-10">
          <Header />
        </div>

        {/* AboutUs Text */}
        <div className="container mx-auto px-2 md:px-4 lg:px-16 xl:px-8 absolute inset-0 flex items-center z-0">
          <h1 className="text-white text-4xl md:text-5xl">About Us</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between lg:gap- bg-white">
        {/* Text Section */}
        <div className="md:w-1/2 lg:w-2/5 xl:w-9/20 2xl:w-1/2 text-center md:text-left py-8 md:p-12 lg:px-8 lg:p-0 xl:p-18 2xl:py-12">
          <p className="text-[#393185] font-medium text-lg lg:text-xl mb-2">
            About Hariom Chemical
          </p>
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#393185] leading-tight mb-4 xl:mb-2">
            Crafting Cleanliness, Delivering Trust
          </h1>
          <p className="text-gray-700 mb-2 lg:mb-0 text-md lg:text-md xl:text-lg 2xl:text-xl px-2 md:px-0 py-3 lg:py-1 xl:py-5">
            Hariom Chemicals is a renowned manufacturer of premium household
            cleaning products and concentrates, proudly based in Vadodara,
            Gujarat. Since our inception, we have remained dedicated to creating
            high-performance, cost-effective, and environmentally responsible
            cleaning solutions that cater to homes, businesses, and institutions
            alike.
          </p>
          <p className="text-gray-700 text-md lg:text-md xl:text-lg 2xl:text-xl px-2 md:px-0 py-3 lg:py-1 xl:py-5">
            At Hariom Chemicals, our mission is simple - to deliver exceptional
            cleanliness with every drop. We understand the vital role hygiene
            plays in daily life, which is why each of our products is formulated
            with precision, quality ingredients, and a deep understanding of
            customer needs. Whether it's a sparkling kitchen, a spotless
            bathroom, or gleaming floors, our products help keep spaces fresh,
            clean, and inviting.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 lg:w-3/5 xl:w-11/20 2xl:w-1/2">
          <img
            src="/images/AboutUsImage.png"
            alt="Cleaning Products"
            className="w-full h-full shadow-lg"
          />
        </div>
      </div>

      {/* Core Values Section */}
      <div className="container mx-auto px-2 md:px-4 lg:px-16 xl:px-8 py-8 md:py-0 lg:py-14 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-[#393185] mb-8 md:mb-12 text-left">
          Our Core Values
        </h2>

        <div className="grid gap-6 md:gap-12">
          {coreValues.map((value, index) => (
            <div key={index} className="flex items-start space-x-4">
              {/* Icon wrapper */}
              <div
                className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-full ${value.color} flex items-center justify-center`}
              >
                <img
                  src={value.icon}
                  alt={value.title}
                  className="w-6 h-6 object-contain"
                />
              </div>

              {/* Text content */}
              <div className="flex-1">
                <h3 className={`text-xl font-semibold ${value.text}`}>
                  {value.title}
                </h3>
                <p className="text-gray-700 xl:text-xl mt-1">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram Feed */}
      <InstagramFeed />
    </>
  );
};

export default AboutUsPage;
