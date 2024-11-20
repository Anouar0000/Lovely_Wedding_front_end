import React from 'react';
import Header from '../components/header/Header'; // Import the extracted header component
import Footer from '../components/footer/Footer'; // Import the Footer component
import { useNavigate } from 'react-router-dom'; // For navigation
import img from '../assets/images/holder.png';

function HomePage() {
  const navigate = useNavigate(); // Hook to handle navigation

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header /> {/* Reusable Header Component */}
      </div>

      {/* Page Content */}
      <div className="pt-[60px]"> {/* Adjust for fixed header height */}
        {/* Hero Section */}
        <section
          className="w-[450px] h-[412px] max-w-full mx-auto p-4 bg-gray-100 flex flex-col justify-center items-center"
        >
          {/* Titles */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-bold">Lovely Invitations</h1>
            <h2 className="text-lg text-gray-600 mt-3">Collection 2025</h2>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* First Button */}
            <button
              className="w-[112px] h-[56px] flex justify-center items-center bg-[#E3E3E3] text-black rounded-md border border-[#767676]"
            >
              Invitations physique
            </button>

            {/* Second Button */}
            <button
              className="w-[112px] h-[56px] flex justify-center items-center bg-[#2C2C2C] text-white rounded-md border-t border-[#2C2C2C]"
              onClick={() => navigate('/canvas')} // Navigate to canvas page
            >
              Invitations Digital
            </button>
          </div>
        </section>

        {/* Shop Wedding Essentials Section */}
        <section className="py-8 px-4">
          <h2
            className="text-center text-2xl font-bold"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              textDecorationSkipInk: 'none',
            }}
          >
            Shop Wedding Essentials
          </h2>
          <h2 className="text-center mb-8">Shop Wedding Essentials</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Invitations */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 h-32 w-full flex items-center justify-center">
                {/* Placeholder for Image */}
                <img
                  src= {img}
                  alt="Invitations"
                  className="h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center">Invitations</p>
            </div>

            {/* Menus */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 h-32 w-full flex items-center justify-center">
                <img
                  src={img}
                  alt="Menus"
                  className="h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center">Menus</p>
            </div>

            {/* Thank You Cards */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 h-32 w-full flex items-center justify-center">
                <img
                  src={img}
                  alt="Thank You Cards"
                  className="h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center">Thank You Cards</p>
            </div>

            {/* Dragées */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 h-32 w-full flex items-center justify-center">
                <img
                  src={img}
                  alt="Dragées"
                  className="h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center">Dragées</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="px-4 py-2 bg-black text-white rounded">More</button>
          </div>
        </section>

        {/* Digital-Only Section */}
        <section className="py-8 px-4 bg-gray-100">
          <h2 className="text-center text-2xl font-bold mb-4">Only Digital</h2>

          {/* Horizontal Scrollable Section */}
          <div className="flex gap-4 overflow-x-auto">
            {/* Item 1 */}
            <div className="bg-white shadow-md p-4 flex-shrink-0 w-64">
              <div className="bg-gray-200 h-32 mb-4"></div>
              <p className="text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="px-4 py-2 border rounded">Button</button>
            </div>

            {/* Item 2 */}
            <div className="bg-white shadow-md p-4 flex-shrink-0 w-64">
              <div className="bg-gray-200 h-32 mb-4"></div>
              <p className="text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="px-4 py-2 border rounded">Button</button>
            </div>

            {/* Item 3 */}
            <div className="bg-white shadow-md p-4 flex-shrink-0 w-64">
              <div className="bg-gray-200 h-32 mb-4"></div>
              <p className="text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="px-4 py-2 border rounded">Button</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
