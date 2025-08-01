"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { FaGoogle, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface GoogleUserData {
  email: string;
  name: string;
  image?: string;
  googleId: string;
}

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<GoogleUserData | null>(null);

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

  // Handle Google sign-in flow based on session data
  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      const user = session.user as any;
      
      if (user.isNewUser === false) {
        // Existing user, redirect to dashboard
        window.location.href = '/dashboard';
      } else if (user.isNewUser === true) {
        // New user, show additional info form
        setIsGoogleFlow(true);
        setGoogleUserData({
          email: user.email!,
          name: user.name!,
          image: user.image,
          googleId: user.googleId,
        });
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
        }));
      }
    }
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";
      
      const response = await fetch(`${backendUrl}/graphql`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': navigator.userAgent || 'Web Browser'
        },
        body: JSON.stringify({
          query: `
            mutation Signup($input: MemberInput!) {
              signup(input: $input) {
                _id
                memberFullName
                memberEmail
                memberPhone
                memberStatus
                memberAuth
              }
            }
          `,
          variables: {
            input: {
              memberFullName: formData.name,
              memberEmail: formData.email,
              memberPhone: formData.phone,
              memberPassword: formData.password,
              memberAuth: "PHONE"
            }
          }
        }),
      });

      const data = await response.json();
      
      if (data.data?.signup) {
        alert("Registration successful! Please login.");
        window.location.href = '/auth/login';
      } else {
        alert(data.errors?.[0]?.message || "Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleGoogleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";
      
      const response = await fetch(`${backendUrl}/graphql`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': navigator.userAgent || 'Web Browser'
        },
        body: JSON.stringify({
          query: `
            mutation Signup($input: MemberInput!) {
              signup(input: $input) {
                _id
                memberFullName
                memberEmail
                memberPhone
                memberStatus
                memberAuth
                memberImage
                memberGoogleId
              }
            }
          `,
          variables: {
            input: {
              memberFullName: formData.name,
              memberEmail: formData.email,
              memberPhone: formData.phone,
              memberPassword: formData.password,
              memberGoogleId: googleUserData?.googleId,
              memberImage: googleUserData?.image,
              memberAuth: "GOOGLE"
            }
          }
        }),
      });

      const data = await response.json();
      
      if (data.data?.signup) {
        alert("Registration completed successfully!");
        window.location.href = '/dashboard';
      } else {
        alert(data.errors?.[0]?.message || "Registration failed");
      }
    } catch (error) {
      console.error('Google registration error:', error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { 
      callbackUrl: window.location.href // Stay on this page to handle the flow
    });
  };

  // Show loading state while NextAuth is processing
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-10">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
        {/* Left Image */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/auth/signup.png"
            alt="Sign up illustration"
            className="w-full max-w-2xl"
          />
        </div>

        {/* Right Form */}
        <div className="w-full max-w-sm mx-auto">
          {isGoogleFlow ? (
            // Google user additional info form
            <>
              <h2 className="text-3xl font-extrabold mb-4 text-gray-900">Complete your profile</h2>
              <p className="text-sm text-gray-600 mb-6">
                We need some additional information to complete your registration.
              </p>
              
              <form className="space-y-4" onSubmit={handleGoogleRegistration}>
                {/* Name (pre-filled from Google) */}
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

                {/* Email (pre-filled and disabled) */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    required
                    value={formData.email}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-sm text-gray-500 bg-gray-50 placeholder-transparent focus:outline-none"
                  />
                  <label className="absolute top-1 left-3 text-xs text-gray-600 bg-white px-1">
                    Email (from Google)
                  </label>
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="phone"
                      placeholder=" "
                      required
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
                    Phone Number *
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
                    Password *
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
                    Confirm Password *
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
                    formData.acceptTerms && formData.phone && formData.password
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!formData.acceptTerms || !formData.phone || !formData.password}
                >
                  Complete Registration
                </button>
              </form>
            </>
          ) : (
            // Regular registration form
            <>
              <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Create your account</h2>

              <form className="space-y-4" onSubmit={handleManualSubmit}>
                {/* Name */}
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

              {/* Social Logins */}
              <div className="flex justify-center gap-4">
                <button
                  className="border rounded-lg p-3 hover:bg-gray-100 transition"
                  onClick={handleGoogleSignIn}
                >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}