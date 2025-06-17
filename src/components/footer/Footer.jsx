import React from 'react';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'; // Import social media icons

function Footer() {
  return (
    <footer className="relative bg-transparent py-8">

      <div className='border-gray-950/25 border-b border-t py-8'>
        {/* Logo */}
        <div className="text-center font-antic text-2xl mb-8">Lovely Invitations</div>
      
        {/* Help & Company Links */}
        <div className="flex justify-center text-gray-600 text-sm mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className='text-center'>
              <h3 className="font-semibold">Commande et contact</h3>
              <a>Délai de traitement</a><br></br>
              <a>Suivi de commande</a><br></br>
              <a>Besoin d'aide</a><br></br>
              <a>Nous contacter</a><br></br>
              <a>Presse</a>
            </div>
            <div className='text-center'>
              <h3 className="font-semibold">Plus sur Lovely Invitations</h3>
              <a>Nos engagements</a><br></br>
              <a>Données personnelles</a><br></br>
              <a>Le journal</a><br></br>
              <a>Cookies</a><br></br>
              <a>Nos faire-part</a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex flex-col items-center mt-8">
        <div className="bottom-4 flex space-x-4">
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
      </div>
    </footer>
  );
}

export default Footer;
