import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi'; // Use react-icons for the menu icon
import HomeSidebar from '../sidebars/HomeSidebar'; // Import the Sidebar component

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Menu Icon */}
        <button
          onClick={handleSidebarToggle}
          className="text-2xl focus:outline-none"
        >
          <FiMenu />
        </button>

        {/* Logo Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-bold">Logo</h1>
        </div>
      </header>

      {/* Sidebar */}
      <HomeSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default Header;

