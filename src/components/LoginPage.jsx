import { useEffect, useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_BASE_URL } from "../config";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and Password are required!");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_BASE_URL}/api/users/login`,
        formData
      );
      console.log(response.data);

      if (
        response.data &&
        (response.data.userId || response.data.isAdmin) &&
        response.data.token
      ) {
        response.data.userId
          ? localStorage.setItem("userId", response.data.userId)
          : localStorage.setItem("isAdmin", response.data.isAdmin);
        localStorage.setItem("token", response.data.token);

        toast.success("Login successful! Redirecting...", {
          duration: 2500,
        });

        if (response.data.isAdmin) {
          setTimeout(() => {
            navigate("/admin");
          }, 2500);
        } else {
          setTimeout(() => {
            navigate("/track-order");
          }, 2500);
        }
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
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
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-[#393185] placeholder-gray-700 placeholder:font-semibold"
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

        <div className="flex justify-end text-md text-gray-800 cursor-pointer">
          Forgot Password?
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#393185] text-white py-4 rounded-md cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="text-center text-gray-500 text-md py-4">OR</div>

        <div className="flex gap-4">
          <button className="w-1/2 border border-gray-400 rounded-md py-4 hover:bg-gray-50">
            Google
          </button>
          <button className="w-1/2 border border-gray-400 rounded-md py-4 hover:bg-gray-50">
            Facebook
          </button>
        </div>

        <div className="text-center text-md text-gray-500 mt-4">
          Can't Log in?{" "}
          <Link to="/signup">
            <span className="text-[#393185] cursor-pointer">
              Sign up an account
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
