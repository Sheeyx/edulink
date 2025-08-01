"use client";

import TelegramLoginButton from "@/components/Telegram/TelegramLoginBtn";
import { FaGoogle, FaTelegram } from "react-icons/fa";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account
        </h1>

        <button
          onClick={() => alert("Google Sign Up")}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mb-4"
        >
          <FaGoogle />
          Sign up with Google
        </button>

        <button
          onClick={() => alert("Telegram Sign Up")}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
        >
          <FaTelegram />
          Sign up with Telegram
        </button>
      </div>
    </div>
  );
}
