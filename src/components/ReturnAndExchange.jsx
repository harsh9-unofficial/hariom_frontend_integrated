import { Phone, Mail } from "lucide-react";

const ReturnAndExchange = () => {
  return (
    <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-fit">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Return & Exchange Policy
          </h2>
          <p className="md:text-xl text-gray-500 mt-1">Home / Return & Exchange</p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 text-gray-700 text-base leading-relaxed space-y-6">
          <p>
            We value your satisfaction and aim to provide a smooth return or exchange
            process for our cleaning products. Please review the conditions below.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              1. Return Eligibility
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Returns are accepted only for damaged, defective, or incorrect items.</li>
              <li>Products must be returned unused, unopened, and in their original packaging.</li>
              <li>Return requests must be made within 36 hours of delivery.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              2. Exchange Policy
            </h3>
            <p className="mt-1">
              Exchanges are only allowed for the same item in case it arrives damaged or
              incorrect. We do not accept exchanges for reasons like change of mind or
              incorrect order placement.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              3. How to Request a Return or Exchange
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Contact us via email or phone within 48 hours of delivery.</li>
              <li>Provide your order number and a clear photo of the item in question.</li>
              <li>Our team will review your request and get back to you with the next steps.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              4. Refunds
            </h3>
            <p className="mt-1">
              Refunds (if applicable) will be processed back to your original payment method
              within 5–7 business days once the return is approved and received.
            </p>
          </div>

          <p>
            Please note that return shipping costs may be borne by the customer unless the
            item was damaged or incorrect due to our error.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Need Help?
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-2">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-[#393185]" />
                <a
                  href="mailto:support@[yourdomain].com"
                  className="text-[#393185] hover:underline"
                >
                  support@[yourdomain].com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-[#393185]" />
                <a
                  href="tel:+91-XXXXXXXXXX"
                  className="text-[#393185] hover:underline"
                >
                  +91-XXXXXXXXXX
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnAndExchange;
