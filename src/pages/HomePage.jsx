import React from 'react';
import Header from '../components/header/Header'; // Import the extracted header component
import Footer from '../components/footer/Footer'; // Import the Footer component
import { useNavigate } from 'react-router-dom'; // For navigation
import mainimg from '../assets/images/mainbackround.jpg';
import calimg from '../assets/images/caligraphy.png';
import img1 from '../assets/images/onlydigital1.png';
import img2 from '../assets/images/outeya.png';

function HomePage() {
  const navigate = useNavigate(); // Hook to handle navigation

const essentialsData = [
  {
    name: 'Rustique',
    bgColor: 'bg-customColor-1', // Your custom beige color
    iconPath: '/assets/icons/Rustique.png'
  },
  {
    name: 'Nouveauté',
    bgColor: 'bg-customColor-2', // Your custom blue color
    iconPath: '/assets/icons/Nouveauté.png'
  },
  {
    name: 'Outeya',
    bgColor: 'bg-customColor-3', // Your custom dusty rose color
    iconPath: null // No icon provided for this one
  },
  {
    name: 'Cachet en Cire',
    bgColor: 'bg-neutral-200',
    iconPath: '/assets/icons/Cachet en cire.png'
  },
  {
    name: 'Moderne',
    bgColor: 'bg-customColor-5', // Your custom mint color
    iconPath: '/assets/icons/Moderne.png'
  },
  {
    name: 'Dragées',
    bgColor: 'bg-customColor-6', // Your custom purple color
    iconPath: '/assets/icons/Dragées.png'
  },
  {
    name: 'Classique',
    bgColor: 'bg-customColor-7', // Your custom light peach color
    iconPath: '/assets/icons/Classique.png'
  },
  {
    name: 'À table',
    bgColor: 'bg-customColor-8', // Your custom light pink color
    iconPath: '/assets/icons/à table.png'
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
  className="pt-4 w-full h-[508px] max-w-full mx-auto flex flex-col justify-center items-center text-white"
  style={{
    backgroundImage: `url(${mainimg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Titles */}
  <div className="flex flex-col items-center pt-12 mb-6 w-full">
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
      onClick={() => navigate('/canvas')}
    >
      Invitations Digital
    </button>
  </div>
</section>


        {/* Shop Wedding Essentials Section */}
<section className="pb-8 px-4 pt-16">
  <h2 className="text-center text-2xl font-abhaya">Shop Wedding Essentials</h2>
  <h2 className="text-center mb-12 font-urbanist">Shop Wedding Essentials</h2>

  {/* The grid now maps over our data array */}
  <div className="grid grid-cols-2 gap-4">
    {essentialsData.map((category) => (
      
      // Each card is now a single, self-contained block
      <div
        key={category.name}
        // These classes are key for the design:
        // - `relative`: Allows us to position the image inside it.
        // - `overflow-hidden`: Clips the image to the card's rounded corners.
        className={`${category.bgColor} relative h-24 w-full rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer`}
      >
        {/* Title text */}
        <h3 className='pl-4 pt-2 font-urbanist text-gray-800 font-medium z-10 relative'>
          {category.name}
        </h3>

        {/* 
          Image is rendered conditionally ONLY if an iconPath exists.
          - `absolute bottom-0 right-0`: Pins it to the bottom-right corner.
          - `h-20 w-auto`: Controls the size of the icon. Adjust if needed.
          - `object-contain`: Prevents the image from being stretched or squished.
          - `pointer-events-none`: Makes sure the image doesn't interfere with clicks on the card.
        */}
        {category.iconPath && (
          <img
            src={category.iconPath}
            alt="" // Decorative images have an empty alt attribute
            className="absolute -bottom-2 -right-2 h-20 w-auto object-contain pointer-events-none"
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

          {/* Horizontal Scrollable Section */}
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {/* Item 1 */}
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

            {/* Item 2 */}
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

            {/* Item 3 */}
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