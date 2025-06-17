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
      <header className="flex items-center justify-between p-4 bg-white shadow-md relative z-50">
        <button
          onClick={handleSidebarToggle}
          className="text-2xl focus:outline-none"
        >
          <FiMenu />
        </button>

        <div
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <h1 className="text-lg font-antic">Lovely Invitations</h1>
        </div>
      </header>

      {/* Sidebar and overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40"
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
