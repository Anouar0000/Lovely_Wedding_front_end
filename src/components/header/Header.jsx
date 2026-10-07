import React, { useState } from 'react';
import { FiMenu, FiShoppingBag } from 'react-icons/fi';
import HomeSidebar from '../sidebars/HomeSidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCart } from '../../context/CartContext';

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 pt-8 pb-6 bg-white relative z-50">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="text-2xl focus:outline-none"
          aria-label="Ouvrir le menu"
        >
          <FiMenu />
        </button>

        <div
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <h1 className="lw-logo text-[18px] lg:text-[20px]">Lovely Invitations</h1>
        </div>

        <div className="flex items-center gap-2 font-urbanist text-sm z-10">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative inline-flex items-center justify-center p-2"
            aria-label="Panier"
          >
            <FiShoppingBag className="text-xl" />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </button>

          {!loading && user ? (
            <>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="hidden sm:inline-flex border border-black px-3 py-1.5 font-semibold"
                >
                  Admin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/espace-client')}
                  className="hidden sm:inline-flex border border-black px-3 py-1.5 font-semibold"
                >
                  Mon espace
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-700 underline underline-offset-2"
              >
                Deconnexion
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gray-800 underline underline-offset-2"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="bg-black px-3 py-1.5 font-semibold text-white"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {isSidebarOpen && (
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
