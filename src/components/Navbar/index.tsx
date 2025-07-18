"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-700">Edulink</div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-purple-700">Home</a>
          <a href="#courses" className="hover:text-purple-700">Courses</a>
          <a href="#blog" className="hover:text-purple-700">Blog</a>
          <a href="#about" className="hover:text-purple-700">About</a>
          <a href="#contact" className="hover:text-purple-700">Contact</a>
        </div>

        {/* Right-side buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button className="p-2 border border-transparent rounded hover:bg-gray-100">
            🛒
          </button>
          <a
            href="/auth/login"
            className="px-4 py-2 border border-purple-600 text-purple-600 font-semibold rounded hover:bg-purple-50"
          >
            Log in
          </a>
          <a
            href="/auth/register"
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700"
          >
            Sign up
          </a>
          <button className="p-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50">
            🌐
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <button
          className="md:hidden text-2xl text-purple-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-white shadow-lg">
          <a href="/" className="block text-gray-700 hover:text-purple-700">Home</a>
          <a href="#courses" className="block text-gray-700 hover:text-purple-700">Courses</a>
          <a href="#blog" className="block text-gray-700 hover:text-purple-700">Blog</a>
          <a href="#about" className="block text-gray-700 hover:text-purple-700">About</a>
          <a href="#contact" className="block text-gray-700 hover:text-purple-700">Contact</a>
          <div className="pt-4 border-t space-y-2">
            <a
              href="/auth/login"
              className="block text-purple-600 border border-purple-600 rounded px-4 py-2 text-center"
            >
              Log in
            </a>
            <a
              href="/auth/register"
              className="block bg-purple-600 text-white rounded px-4 py-2 text-center"
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
