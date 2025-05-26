import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../config";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }

    return errors;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({});

    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = "Fullname is required!";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required!";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required!";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email address!";
      }
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required!";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits!";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required!";
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match!";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);

      Object.entries(errors).forEach(([field, msg]) => {
        if (Array.isArray(msg)) {
          msg.forEach((singleMsg) => toast.error(singleMsg));
        } else {
          toast.error(msg);
        }
      });

      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${USER_BASE_URL}/api/users/signup`, {
        fullname: formData.fullname,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success("Sign up successful! Redirecting to login...", {
        duration: 2500,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      let serverMessage = "An error occurred. Please try again.";

      if (err.response && err.response.data && err.response.data.message) {
        serverMessage = err.response.data.message;
      }

      setError({ form: serverMessage });
      toast.error(serverMessage);
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2">
      <div className="mb-6">
        <Link to="/">
          <img
            src="/images/logo-new2.png"
            alt="Hari Om Chemicals Logo"
            className="w-28 h-auto mx-auto"
          />
        </Link>
      </div>

      <div className="w-full max-w-xl space-y-4">
        <div className="relative">
          <input
            type="text"
            name="fullname"
            placeholder="Fullname"
            value={formData.fullname}
            onChange={handleChange}
            className={`w-full border ${
              error.fullname ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold`}
          />
        </div>

        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full border ${
              error.username ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold`}
          />
        </div>

        <div className="relative">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            pattern="[6-9]{1}[0-9]{9}"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border ${
              error.phone ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold`}
          />
        </div>

        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border ${
              error.email ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold`}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border ${
              error.password ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold`}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repeat Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full border ${
              error.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold`}
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-6"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-800 cursor-pointer" />
            ) : (
              <Eye className="w-5 h-5 text-gray-800 cursor-pointer" />
            )}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#393185] text-white py-4 rounded-md cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="text-center text-md text-gray-500 mt-4">
          Can't Sign up?{" "}
          <Link to="/login">
            <span className="text-[#393185] cursor-pointer">
              Log in an account
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
