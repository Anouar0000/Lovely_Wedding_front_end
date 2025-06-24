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
  className="w-full h-[412px] max-w-full mx-auto flex flex-col justify-center items-center text-white"
  style={{
    backgroundImage: `url(${mainimg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
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
      onClick={() => navigate('/canvas')}
    >
      Invitations Digital
    </button>
  </div>
</section>


        {/* Shop Wedding Essentials Section */}
        <section className="py-8 px-4">
          <h2 className="text-center text-2xl font-abhaya">Shop Wedding Essentials</h2>
          <h2 className="text-center mb-12 font-urbanist">Shop Wedding Essentials</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Invitations */}
            <div className="flex flex-col items-center">
              <div className="bg-customColor-1 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Rustique</h1>
              </div>
            </div>

            {/* Menus */}
            <div className="flex flex-col items-center">
              <div className="bg-customColor-2 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Nouveauté</h1>
              </div>
            </div>


            {/* Thank You Cards */}
            <div className="flex flex-col items-center">
              <div className="bg-customColor-3 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Outeya</h1>
              </div>
            </div>


            {/* Dragées */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Cachet en Cire</h1>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-customColor-5 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Moderne</h1>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-customColor-6 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Dragées</h1>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-customColor-7 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>Classique</h1>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-customColor-8 h-24 w-full flex rounded-md">
                <h1 className='pl-4 pt-2 font-urbanist'>À table</h1>
              </div>
            </div>

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