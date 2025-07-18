"use client";

import { useState } from "react";
import { FaGoogle, FaTelegramPlane } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-10">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 py-12">

        {/* Image */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/auth/login.png"
            alt="Login illustration"
            className="w-full max-w-2xl"
          />
        </div>

        {/* Form */}
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Welcome Back</h2>

          <form className="space-y-5">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm font-medium">Or sign in with</span>
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

          <p className="text-sm text-center text-gray-700 mt-6">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-purple-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
