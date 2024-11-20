import React from 'react';
import SidebarModal from './SidebarModal';

function ColorSidebar({ onClose }) {
  return (
    <SidebarModal title="Choose Colors" onClose={onClose}>
      {/* Color options */}
      <div className="grid grid-cols-3 gap-4">
        <div className="w-8 h-8 bg-red-500 rounded cursor-pointer"></div>
        <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer"></div>
        <div className="w-8 h-8 bg-green-500 rounded cursor-pointer"></div>
        {/* Add more color options */}
      </div>
    </SidebarModal>
  );
}

export default ColorSidebar;
