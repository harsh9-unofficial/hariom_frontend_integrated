import { Phone, Mail, MapPin } from "lucide-react";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { toast } from "react-hot-toast";

const handleSubmit = async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const message = e.target.message.value;

  try {
    const response = await axios.post(
      `${USER_BASE_URL}/api/contacts/addContact`,
      {
        name,
        email,
        message,
      }
    );

    if (response.status === 201) {
      toast.success("Message sent successfully!");
      e.target.reset(); // Reset the form
    } else {
      toast.error("Failed to send message. Please try again later.");
    }
  } catch (error) {
    console.error("Axios error:", error);
    toast.error("An error occurred. Please try again.");
  }
};

const ContactUsPage = () => {
  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-10 xl:px-8 py-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
        Contact Us
      </h2>
      <p className="text-lg md:text-xl text-gray-500 mb-6">Home / Contact Us</p>

      <p className="text-gray-700 mb-10 max-w-xl">
        Get in touch with our team for inquiries about our products and
        services.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 lg:gap-8">
        {/* Contact Form */}
        <form className="space-y-6 md:pt-8" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1 text-xl">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border border-[#B7B4FF] rounded px-4 py-4 outline-none focus:ring-2 focus:ring-[#393185]"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-xl">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border border-[#B7B4FF] rounded px-4 py-4 outline-none focus:ring-2 focus:ring-[#393185]"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-xl">Message</label>
            <textarea
              rows="9"
              name="message"
              placeholder="Your Message"
              className="w-full border border-[#B7B4FF] rounded px-4 py-4 outline-none focus:ring-2 focus:ring-[#393185] resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#393185] text-white py-3 rounded cursor-pointer transition"
          >
            Send Message
          </button>
        </form>

        {/* Info and Map */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-4xl font-semibold">Get in touch</h2>
          <div className="flex gap-4">
            <div className="bg-[#393185] text-white p-3 md:p-4 rounded-full cursor-pointer">
              <Phone size={20} className="md:size-5 lg:size-6" />
            </div>
            <div className="bg-[#393185] text-white p-3 md:p-4 rounded-full cursor-pointer">
              <Mail size={20} className="sm:size-5 lg:size-6" />
            </div>
            <div className="bg-[#393185] text-white p-3 md:p-4 rounded-full cursor-pointer">
              <MapPin size={20} className="sm:size-5 lg:size-6" />
            </div>
          </div>

          {/* Map Embed */}
          <div className="h-155 rounded overflow-hidden">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.7353480561047!2d72.86622937592094!3d21.20154778160183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f258cd9f1cb%3A0x3e347b8854cf76f6!2sChikuwadi%2C%20Surat%2C%20Gujarat%20395010!5e0!3m2!1sen!2sin!4v1712659058050!5m2!1sen!2sin"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
