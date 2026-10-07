import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const orderLinks = [
  { label: 'Délai de traitement', to: '/invitations-physique' },
  { label: 'Suivi de commande', to: '/login' },
  { label: "Besoin d'aide", to: '/login' },
  { label: 'Nous contacter', to: '/signup' },
  { label: 'Presse', to: '/invitations-digital' },
];

const companyLinks = [
  { label: 'Nos engagements', to: '/' },
  { label: 'Données personnelles', to: '/' },
  { label: 'Le journal', to: '/invitations-digital' },
  { label: 'Cookies', to: '/' },
  { label: 'Nos faire-part', to: '/invitations-physique' },
];

function Footer() {
  return (
    <footer className="relative bg-transparent py-8">
      <div className="border-gray-950/25 border-b border-t py-8">
        <div className="mb-8 text-center lw-logo text-[28px]">Lovely Invitations</div>

        <div className="flex justify-center text-gray-600 text-sm mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Commande et contact</h3>
              <ul className="space-y-1">
                {orderLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-black hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Plus sur Lovely Invitations</h3>
              <ul className="space-y-1">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-black hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <div className="bottom-4 flex space-x-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-600 hover:text-black"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-gray-600 hover:text-black"
          >
            <FaTwitter />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-gray-600 hover:text-black"
          >
            <FaYoutube />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-600 hover:text-black"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
