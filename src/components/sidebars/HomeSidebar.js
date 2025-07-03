import React, { useEffect, useRef } from 'react';
import NestedList from './NestedList';

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
        children: [{ name: 'Cérémonie' }, { name: 'Outeya/Henna' }, { name: 'Hammam' }, { name: 'Ichhar' }, { name: 'EVJF' }],
      },
      {
        name: 'Fêtes',
        children: [{ name: 'Anniversaires' }, { name: 'Baptême' }, { name: 'Naissance' }, { name: 'Nouvel an' }],
      },
      {
        name: 'Evénements',
        children: [{ name: 'Inuguration' }, { name: 'Buissness Event' }, { name: 'Team Building' }],
      },
    ],
  },
];

function HomeSidebar({ isOpen, onClose, resetKey }) {
  const navRef = useRef(null);

  // FIX #2: Prevents scroll "chaining" from the sidebar to the main page body.
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = navElement;
      if (
        (e.deltaY < 0 && scrollTop === 0) ||
        (e.deltaY > 0 && scrollHeight - clientHeight - scrollTop < 1)
      ) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    navElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => navElement.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-0 left-0 h-full w-80 bg-white text-black transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-[60] shadow-lg`}
    >
      <div className="flex justify-center items-center py-4 ">
        <h1 className="text-lg font-bold">Logo</h1>
      </div>
      <button onClick={onClose} className="text-black text-xl absolute top-4 right-4 focus:outline-none">
        ✕
      </button>
      <nav ref={navRef} className="py-4 overflow-y-auto h-[calc(100vh-64px)]">
        <NestedList items={nestedItems} resetKey={resetKey} onClose={onClose} />
      </nav>
    </div>
  );
}

export default HomeSidebar;