"use client";

import { useState } from "react";
import { FaGoogle, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-10">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 py-12">

        {/* Left Image Section */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/auth/signup.png"
            alt="Sign up illustration"
            className="w-full max-w-2xl"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Create your account</h2>

          <form className="space-y-4">

            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder=" "
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder=" "
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Email
              </label>
            </div>

            {/* Phone */}
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                >
                  Verify
                </button>
              </div>
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Phone
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=" "
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 pr-10 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder=" "
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 pr-10 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
              />
              I accept the{" "}
              <a href="#" className="ml-1 text-purple-600 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 underline ml-1">
                Privacy Policy
              </a>.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold transition ${
                formData.acceptTerms
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!formData.acceptTerms}
            >
              <FaEnvelope />
              Sign Up with Email
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm font-medium">Or sign up with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-4">
            <button className="border rounded-lg p-3 hover:bg-gray-100 transition">
              <FaGoogle className="text-xl text-red-500" />
            </button>
            <button className="border rounded-lg p-3 hover:bg-gray-100 transition">
              <FaTelegramPlane className="text-xl text-blue-500" />
            </button>
            <button className="border rounded-lg p-3 hover:bg-gray-100 transition">
              <SiKakaotalk className="text-xl text-yellow-500" />
            </button>
          </div>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-purple-600 font-semibold hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
