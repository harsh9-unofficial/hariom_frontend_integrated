import { Phone, Mail } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-fit">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Shipping Policies
          </h2>
          <p className="md:text-xl text-gray-500 mt-1">
            Home / Shipping Policies
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 text-gray-700 text-base leading-relaxed">
          <div className="space-y-6">
            <p>We currently deliver our cleaning products across India.</p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Processing Time
              </h3>
              <p>Orders are packed and shipped within 2-3 business days.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Delivery Time
              </h3>
              <p>
                Most orders are delivered within 5-8 working days, depending on
                your location.
              </p>
            </div>

            <p>
              Cash on Delivery (COD) is available for select pin codes with an
              additional fee of ₹30.
            </p>

            <p>
              If an order is returned to us due to incorrect address or failed
              delivery attempts, you may be asked to pay the shipping fee again
              for redelivery.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Shipping Charges
              </h3>
              <p className="mt-1">
                Free shipping applies only to our standard shipping options:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Free shipping on orders above ₹500</li>
                <li>A flat fee of ₹50 applies for orders below ₹500</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                How do I track the status of an order?
              </h3>
              <p>
                You’ll receive a tracking link by email or SMS once your order
                is shipped.
              </p>
            </div>

            <p>
              Please ensure the correct delivery address is provided. We are not
              responsible for delays or failed deliveries due to incorrect
              information.
            </p>

            <p>
              If your product arrives damaged or there's an issue, contact us
              within 24 hours of delivery.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                For any questions, feel free to reach out at:
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
    </div>
  );
};

export default ShippingPolicy;
