import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What types of cleaning products do you sell?",
    answer:
      "We offer a wide range of cleaning products including phenyls, surface cleaners, toilet cleaners, disinfectants, and more.",
  },
  {
    question: "Are your products safe for children and pets?",
    answer:
      "Yes, our products are formulated with safety in mind. However, we recommend keeping them out of reach of children and pets, and using them as directed.",
  },
  {
    question: "How can I place an order?",
    answer:
      "You can place an order directly through our website by adding products to your cart and proceeding to checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major debit/credit cards, UPI, net banking, and Cash on Delivery (for select locations).",
  },
  {
    question: "Do you offer bulk or wholesale orders?",
    answer:
      "Yes, we do accept bulk or wholesale orders. Please contact us directly via email or phone for pricing and availability.",
  },
  {
    question: "Can I cancel or change my order?",
    answer:
      "You can cancel or modify your order within 12 hours of placing it by contacting our support team. Once shipped, changes may not be possible.",
  },
  {
    question: "Do you provide order tracking?",
    answer:
      "Yes, once your order is shipped, you will receive a tracking link via email or SMS to monitor your delivery status in real time.",
  },
  {
    question: "What if my product arrives damaged or leaking?",
    answer:
      "If your item is damaged, leaking, or not in usable condition, please contact us within 24 hours of delivery with photos. We'll resolve the issue promptly.",
  },
  {
    question: "Is there a minimum order value?",
    answer:
      "No minimum order value is required. However, orders below ₹500 incur a shipping fee of ₹50. Orders above ₹500 qualify for free standard shipping.",
  },
  {
    question: "Can I schedule delivery on a specific date?",
    answer:
      "At the moment, we do not offer scheduled delivery. All orders follow our standard delivery timelines based on your location.",
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-10 sm:py-16 bg-gray-50 min-h-fit">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        {/* <header className="mb-10 text-center"> */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            FAQs (Frequently Asked Questions)
          </h2>
          <p className="md:text-xl text-gray-500 mt-1">Home / FAQs</p>
          {/* </header> */}
        </div>

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-b py-5 transition-colors duration-200 cursor-pointer ${
                openIndex === index ? "bg-gray-50" : ""
              }`}
            >
              <button
                className="flex justify-between gap-2 items-center w-full text-left focus:outline-none cursor-pointer"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="w-64 md:w-full md:text-lg font-medium text-gray-800 hover:text-[#393185]">
                  {faq.question}
                </span>
                <ChevronDown
                  size={24}
                  className={`w-10 text-[#393185] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="mt-3 text-gray-600 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Faqs;
