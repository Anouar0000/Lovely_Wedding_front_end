import React, { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { BiText } from 'react-icons/bi';
import { MdColorLens } from 'react-icons/md';

import DesignSidebar from './DesignSidebar';
import TextSidebar from './TextSidebar';
import ColorSidebar from './ColorSidebar';

function Sidebar({ fields, onFieldChange, onTemplateChange }) {
  const [activeSidebar, setActiveSidebar] = useState(null);

  const handleSidebarToggle = (sidebar) => {
    setActiveSidebar(activeSidebar === sidebar ? null : sidebar);
  };

  const closeModal = () => setActiveSidebar(null);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Bottom Navbar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex md:w-16 md:flex-col md:h-screen p-2 md:justify-center z-10 shadow-lg">
        <nav className="w-full flex justify-around md:flex-col md:items-center">
          <ul className="flex justify-around w-full md:flex-col md:items-center gap-4 md:gap-6">
            <li>
              <a
                href="#design"
                onClick={() => handleSidebarToggle('design')}
                className={`flex flex-col items-center text-sm transition-all duration-200 ${
                  activeSidebar === 'design'
                    ? 'text-green-400'
                    : 'hover:text-green-300'
                }`}
              >
                <FiEdit3 className="text-2xl mb-1" />
                <span>Design</span>
              </a>
            </li>
            <li>
              <a
                href="#text"
                onClick={() => handleSidebarToggle('text')}
                className={`flex flex-col items-center text-sm transition-all duration-200 ${
                  activeSidebar === 'text'
                    ? 'text-purple-400'
                    : 'hover:text-purple-300'
                }`}
              >
                <BiText className="text-2xl mb-1" />
                <span>Text</span>
              </a>
            </li>
            <li>
              <a
                href="#color"
                onClick={() => handleSidebarToggle('color')}
                className={`flex flex-col items-center text-sm transition-all duration-200 ${
                  activeSidebar === 'color'
                    ? 'text-blue-400'
                    : 'hover:text-blue-300'
                }`}
              >
                <MdColorLens className="text-2xl mb-1" />
                <span>Colors</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Conditionally Rendered Sub-Sidebars */}
      {activeSidebar === 'design' && (
        <DesignSidebar
          onTemplateChange={onTemplateChange}
          onClose={closeModal}
        />
      )}
      {activeSidebar === 'text' && (
        <TextSidebar
          fields={fields}
          onFieldChange={onFieldChange}
          onClose={closeModal}
        />
      )}
      {activeSidebar === 'color' && <ColorSidebar onClose={closeModal} />}
    </div>
  );
}

export default Sidebar;
