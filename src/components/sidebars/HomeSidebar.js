import React, { useEffect, useRef } from 'react';
import NestedList from './NestedList';

const nestedItems = [
  {
    name: 'Invitations physique',
    children: [
      { name: 'Cérémonie/Contrat/Récéption', path: '/invitations-physique', category: 'Mariage' },
      { name: 'Outeya/Henna', path: '/invitations-physique', category: 'Outeya' },
      { name: 'Soulameya', path: '/invitations-physique', category: 'Soulameya' },
      { name: 'Menus', path: '/invitations-physique', category: 'Menus' },
      { name: 'Thank you card', path: '/invitations-physique', category: 'Mariage' },
      { name: 'EVJF', path: '/invitations-physique', category: 'Mariage' },
    ],
  },
  {
    name: 'Invitations Digital',
    children: [
      {
        name: 'Mariage',
        children: [
          { name: 'Cérémonie', path: '/invitations-digital' },
          { name: 'Outeya/Henna', path: '/invitations-digital' },
          { name: 'Hammam', path: '/invitations-digital' },
          { name: 'Ichhar', path: '/invitations-digital' },
          { name: 'EVJF', path: '/invitations-digital' },
        ],
      },
      {
        name: 'Fêtes',
        children: [
          { name: 'Anniversaires', path: '/invitations-digital' },
          { name: 'Baptême', path: '/invitations-digital' },
          { name: 'Naissance', path: '/invitations-digital' },
          { name: 'Nouvel an', path: '/invitations-digital' },
        ],
      },
      {
        name: 'Evénements',
        children: [
          { name: 'Inuguration', path: '/invitations-digital' },
          { name: 'Buissness Event', path: '/invitations-digital' },
          { name: 'Team Building', path: '/invitations-digital' },
        ],
      },
    ],
  },
];

function HomeSidebar({ isOpen, onClose, resetKey }) {
  const navRef = useRef(null);

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
        <h1 className="lw-logo text-[18px]">Lovely Invitations</h1>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-black text-xl absolute top-4 right-4 focus:outline-none"
        aria-label="Fermer le menu"
      >
        ✕
      </button>
      <nav ref={navRef} className="py-4 overflow-y-auto h-[calc(100vh-64px)]">
        <NestedList items={nestedItems} resetKey={resetKey} onClose={onClose} />
      </nav>
    </div>
  );
}

export default HomeSidebar;
