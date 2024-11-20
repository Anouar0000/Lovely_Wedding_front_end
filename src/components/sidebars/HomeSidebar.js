import React from 'react';
import NestedList from './NestedList'; // Import the NestedList component

const nestedItems = [
  {
    name: 'Invitations physique',
    children: [
      { name: 'Cérémonie/Contrat/Récéption' },
      { name: 'Outeya/Henna' },
      { name: 'Soulameya' },
      { name: 'Menus' },
      { name: 'Thank you card' },
      { name: 'EVJF' },
    ],
  },
  {
    name: 'Invitations Digital',
    children: [
      {
        name: 'Mariage',
        children: [
          { name: 'Cérémonie' },
          { name: 'Outeya/Henna' },
          { name: 'Hammam' },
          { name: 'Ichhar' },
          { name: 'EVJF' },
        ],
      },
      {
        name: 'Fêtes',
        children: [
          { name: 'Anniversaires' },
          { name: 'Baptême' },
          { name: 'Naissance' },
          { name: 'Nouvel an' },
        ],
      },
      {
        name: 'Evénements',
        children: [
          { name: 'Inuguration' },
          { name: 'Buissness Event' },
          { name: 'Team Building' },
        ],
      },
    ],
  },
];

function HomeSidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white text-black transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-center items-center py-4 border-b border-gray-300">
        <h1 className="text-lg font-bold">Logo</h1>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-black text-xl absolute top-4 right-4 focus:outline-none"
      >
        ✕
      </button>

      {/* Navigation and Nested List with Scroll */}
      <nav className="p-4 overflow-y-auto h-[calc(100vh-64px)]"> {/* Adjust height to be scrollable */}
        <NestedList items={nestedItems} /> {/* Render the nested list */}
      </nav>
    </div>
  );
}

export default HomeSidebar;
