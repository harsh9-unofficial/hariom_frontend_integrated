import { Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-fit">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl md:text-4xl font-semibold">Privacy Policy</h2>
          <p className="md:text-xl text-gray-500 mt-1">Home / Privacy Policy</p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 text-gray-700 text-base leading-relaxed space-y-6">
          <p>
            This Privacy Policy describes how we collect, use, and protect your
            information when you use our website or make a purchase from our
            store.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              1. Information We Collect
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Personal Information: name, email address, phone number, etc.
              </li>
              <li>Shipping & Billing Address</li>
              <li>
                Payment Details (processed securely via third-party gateways)
              </li>
              <li>Website usage data (via cookies or analytics tools)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              2. How We Use Your Information
            </h3>
            <p className="mt-1">We use your information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Improve our website and services</li>
              <li>Send order updates and promotional emails (if subscribed)</li>
              <li>Provide customer support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              3. Sharing of Information
            </h3>
            <p className="mt-1">
              We do not sell or rent your personal information. We only share it
              with:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Trusted payment and logistics partners</li>
              <li>Law enforcement if required by law</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              4. Cookies & Tracking
            </h3>
            <p className="mt-1">
              We use cookies to enhance your browsing experience and analyze
              website traffic. You can choose to disable cookies in your browser
              settings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              5. Data Security
            </h3>
            <p className="mt-1">
              We use industry-standard encryption and security practices to
              protect your personal data. However, no system is 100% secure.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              6. Your Rights
            </h3>
            <p className="mt-1">
              You can request to access, correct, or delete your personal
              information by contacting us at:
            </p>
            <p className="flex items-center gap-2">
              <Mail size={20} className="text-[#393185]" />
              <a
                href="mailto:support@[yourdomain].com"
                className="text-[#393185] hover:underline"
              >
                support@[yourdomain].com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              7. Changes to This Policy
            </h3>
            <p className="mt-1">
              We may update this Privacy Policy occasionally. Any changes will
              be posted on this page with a revised date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
