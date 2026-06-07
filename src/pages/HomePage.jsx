import React from 'react';
import Header from '../components/header/Header'; // Import the extracted header component
import Footer from '../components/footer/Footer'; // Import the Footer component
import { useNavigate } from 'react-router-dom'; // For navigation
import mainimg from '../assets/images/mainbackround.jpg';
import mainVideo from '../assets/videos/trailer.webm';
import calimg from '../assets/images/caligraphy.png';
import img1 from '../assets/images/onlydigital1.png';
import img2 from '../assets/images/outeya.png';

function HomePage() {
  const navigate = useNavigate(); // Hook to handle navigation

  // --- MODIFIED DATA ARRAY ---
  // Each icon now has its own 'iconClasses' property for unique styling.
  const essentialsData = [
    {
      name: 'Rustique',
      bgColor: 'bg-customColor-1', // Your custom beige color
      iconPath: '/assets/icons/Rustique.webp',
      // Example: A bit larger and further down
      iconClasses: 'absolute -bottom-4 -right-0 h-24 w-auto object-contain pointer-events-none'
    },
    {
      name: 'Nouveauté',
      bgColor: 'bg-customColor-2', // Your custom blue color
      iconPath: '/assets/icons/Nouveauté.webp',
      // Example: The original default size
      iconClasses: 'absolute -bottom-6 -right-3 h-24 w-auto object-contain pointer-events-none'
    },
    {
      name: 'Outeya',
      bgColor: 'bg-customColor-3', // Your custom dusty rose color
      iconPath: null // No icon provided for this one
      // No iconClasses needed if there's no iconPath
    },
    {
      name: 'Cachet en Cire',
      bgColor: 'bg-neutral-200',
      iconPath: '/assets/icons/Cachet en cire.png',
      // Example: Smaller and positioned differently
      iconClasses: 'absolute -bottom-20 -right-6 h-auto w-[200px] object-contain pointer-events-none'
    },
    {
      name: 'Moderne',
      bgColor: 'bg-customColor-5', // Your custom mint color
      iconPath: '/assets/icons/Moderne.webp',
      // Example: Taller and shifted more to the right
      iconClasses: 'absolute -bottom-14 -right-8 h-auto w-[200px] object-contain pointer-events-none'
    },
    {
      name: 'Dragées',
      bgColor: 'bg-customColor-6', // Your custom purple color
      iconPath: '/assets/icons/Dragées.png',
      // Example: Different size and position
      iconClasses: 'absolute bottom-0 right-0 h-20 w-auto object-contain pointer-events-none'
    },
    {
      name: 'Classique',
      bgColor: 'bg-customColor-7', // Your custom light peach color
      iconPath: '/assets/icons/Classique.webp',
      // Example: Very large to show the effect
      iconClasses: 'absolute -bottom-7 -right-5 h-24 w-auto object-contain pointer-events-none'
    },
    {
      name: 'À table',
      bgColor: 'bg-customColor-8', // Your custom light pink color
      iconPath: '/assets/icons/à table.webp',
      iconClasses: 'absolute -bottom-7 -right-3 h-28 w-auto object-contain pointer-events-none'
    }
  ];

  return (
    <div className="font-sans bg-[#F4F4F4]">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header /> {/* Reusable Header Component */}
      </div>

      {/* Page Content */}
      <div className="pt-[57px]"> {/* Adjust for fixed header height */}
        {/* Hero Section */}
<section
  className="relative overflow-hidden pt-4 w-full h-[508px] max-w-full mx-auto flex flex-col justify-center items-center text-white"
>
  {/* The Video Element - This part was already perfect! */}
  <video
    src={mainVideo}
    poster={mainimg}
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover -z-1"
  >
    Your browser does not support the video tag.
  </video>

  {/* Your content (titles and buttons) remains the same. */}
  {/* It's good practice to wrap it to ensure it stays on top. */}
  <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
      {/* Titles */}
      <div className="flex flex-col items-center mb-6 w-full">
        <h1 className="text-2xl text-center font-abhaya">Pour tous les moments qui comptent.</h1>
        <h2 className="text-lg text-gray-200 mt-3 font-urbanist">Collection 2025</h2>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 w-full px-4">
        <button
          className="w-full h-[56px] flex justify-center items-center bg-transparent text-white border-b-2 border-white"
          onClick={() => navigate('/invitations-physique')}
        >
          Invitations physique
        </button>

        <button
          className="w-full h-[56px] flex justify-center items-center bg-transparent text-white border-b-2 border-white"
          onClick={() => navigate('/invitations-digital')}
        >
          Invitations Digital
        </button>
      </div>
  </div>
</section>

        {/* Shop Wedding Essentials Section */}
        <section className="pb-8 px-4 pt-16">
          <h2 className="text-center text-2xl font-abhaya">Shop Wedding Essentials</h2>
          <h2 className="text-center mb-12 font-urbanist">Shop Wedding Essentials</h2>

          <div className="grid grid-cols-2 gap-4">
            {essentialsData.map((category) => (
              <div
                key={category.name}
                className={`${category.bgColor} relative h-24 w-full rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer`}
              >
                <h3 className='pl-4 pt-2 font-urbanist text-gray-800 font-medium z-10 relative'>
                  {category.name}
                </h3>

                {/* --- UPDATED IMAGE TAG --- */}
                {/* It now uses the 'iconClasses' from our data object for styling */}
                {category.iconPath && (
                  <img
                    src={category.iconPath}
                    alt=""
                    className={category.iconClasses}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Digital-Only Section */}
        <section className="py-8 px-4">
          <h2 className="text-center text-2xl font-abhaya">Only Digital</h2>
          <h2 className="text-center mb-12 font-urbanist">Only Digital</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            <div className="bg-white shadow-full p-4 flex-shrink-0 w-64">
              <div className="bg-gray-200 h-32 mb-4"><img className="w-full h-full object-cover" src={img1} alt="" /></div>
              <h2 className="text-xl test-left font-abhaya mb-2">Only Digital</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Classic stationery-inspired designs
                Elevate your event with curated envelopes, liners, and stamps
                Exclusive partner collections with
                world-class designers
              </p>
              <button className="py-2 bg-transparent text-black border-b-2 border-black mb-3">Voir plus</button>
            </div>
            <div className="bg-white shadow-full p-4 flex-shrink-0 w-64">
              <div className="bg-gray-200 h-32 mb-4"><img className="w-full h-full object-cover" src={img2} alt="" /></div>
              <h2 className="text-xl test-left font-abhaya mb-2">Only Digital</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Classic stationery-inspired designs
                Elevate your event with curated envelopes, liners, and stamps
                Exclusive partner collections with
                world-class designers
              </p>
              <button className="py-2 bg-transparent text-black border-b-2 border-black mb-3">Voir plus</button>
            </div>
            <div className="bg-white shadow-full p-4 flex-shrink-0 w-64">
              <div className="bg-gray-200 h-32 mb-4"><img className="w-full h-full object-cover" src={mainimg} alt="" /></div>
              <h2 className="text-xl test-left font-abhaya mb-2">Only Digital</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Classic stationery-inspired designs
                Elevate your event with curated envelopes, liners, and stamps
                Exclusive partner collections with
                world-class designers
              </p>
              <button className="py-2 bg-transparent text-black border-b-2 border-black mb-3">Voir plus</button>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4"><img src={calimg} alt="" /></div>
            <div>
              <h2 className="text-xl test-left font-abhaya mb-2">Calligraphie</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Optez pour un faire-part mariage luxueux et chic qui reflètera l'élégance et le raffinement de votre événement. Avec des designs haut de gamme
              </p>
              <button className="py-2 bg-transparent text-black border-b-2 border-black mb-3">Découvrir</button>
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
