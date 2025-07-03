import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import HomeSidebar from '../sidebars/HomeSidebar';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* The header is given a z-index of 50 to place it in the stacking context. */}
      <header className="flex items-center justify-between px-4 pt-8 pb-6 bg-white relative z-50">
        {/* Hamburger Menu Button */}
        <button
          onClick={handleSidebarToggle}
          className="text-2xl focus:outline-none"
        >
          <FiMenu />
        </button>

        {/* Centered Logo/Title */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <h1 className="text-lg font-antic">Lovely Invitations</h1>
        </div>
      </header>

      {/* This block handles the sidebar and the overlay */}
      {isSidebarOpen && (
        // The overlay has a z-index of 55, which is HIGHER than the header's z-50.
        // This makes it cover the entire screen, including the header, so any click
        // outside the sidebar will be caught by this overlay's onClick handler.
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setSidebarOpen(false)}
        >
          <HomeSidebar
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(false)}
            resetKey={isSidebarOpen ? 'open' : 'closed'}
          />
        </div>
      )}
    </>
  );
}

export default Header;