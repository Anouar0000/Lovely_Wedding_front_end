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
              <span>Délai de traitement</span><br></br>
              <span>Suivi de commande</span><br />
              <span>Besoin d'aide</span><br />
              <span>Nous contacter</span><br />
              <span>Presse</span>
            </div>
            <div className='text-center'>
              <h3 className="font-semibold">Plus sur Lovely Invitations</h3>
              <span>Nos engagements</span><br />
              <span>Données personnelles</span><br></br>
              <span>Le journal</span><br />
              <span>Cookies</span><br />
              <span>Nos faire-part</span>
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
