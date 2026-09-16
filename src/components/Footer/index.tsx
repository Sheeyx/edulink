import { FaTelegramPlane, FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Hubee</h2>
          <p className="text-sm leading-relaxed">
            A modern platform for learning English and Korean online through live and video lessons. Anywhere. Anytime.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-brand-primary mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-brand-primary transition duration-200">Home</a>
            </li>
            <li>
              <a href="#courses" className="hover:text-brand-primary transition duration-200">Courses</a>
            </li>
            <li>
              <a href="#about" className="hover:text-brand-primary transition duration-200">About</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-brand-primary transition duration-200">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-brand-primary mb-3">Contact</h3>
          <p className="text-sm mb-4">Phone: <a href="tel:+998901234567" className="hover:text-brand-primary">+998 90 123 45 67</a></p>
          <div className="flex space-x-4 text-xl text-brand-primary">
            <a href="https://t.me/yourchannel" target="_blank" className="hover:text-brand-selected transition">
              <FaTelegramPlane />
            </a>
            <a href="https://instagram.com/yourprofile" target="_blank" className="hover:text-brand-selected transition">
              <FaInstagram />
            </a>
            <a href="https://youtube.com/yourchannel" target="_blank" className="hover:text-brand-selected transition">
              <FaYoutube />
            </a>
            <a href="https://facebook.com/yourpage" target="_blank" className="hover:text-brand-selected transition">
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="bg-gray-100 text-center py-4 text-sm text-gray-600 border-t">
        © {new Date().getFullYear()} Hubee. All rights reserved.
      </div>
    </footer>
  );
}
