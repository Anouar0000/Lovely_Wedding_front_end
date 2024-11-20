import React from 'react';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'; // Import social media icons

function Footer() {
  return (
    <footer className="relative bg-white py-8 px-2">
      {/* Logo */}
      <div className="text-center font-bold mb-4">Logo</div>
      
      {/* Help & Company Links */}
      <div className="flex justify-center space-x-16 text-gray-600 text-sm mb-6">
        <div>
          <h3 className="font-semibold">Help</h3>
          <p>Lorem ipsum dolor sit amet</p>
        </div>
        <div>
          <h3 className="font-semibold">Company</h3>
          <p>Lorem ipsum dolor sit amet</p>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="absolute bottom-4 right-4 flex space-x-4">
      <a href="https://twitter.com" role="button" className="text-gray-600 hover:text-black">
  <FaTwitter />
</a>
<a href="https://instagram.com" role="button" className="text-gray-600 hover:text-black">
  <FaInstagram />
</a>
<a href="https://youtube.com" role="button" className="text-gray-600 hover:text-black">
  <FaYoutube />
</a>
<a href="https://linkedin.com" role="button" className="text-gray-600 hover:text-black">
  <FaLinkedin />
</a>
      </div>
    </footer>
  );
}

export default Footer;
