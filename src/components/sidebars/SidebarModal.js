import React from 'react';

function SidebarModal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-11/12 max-w-md bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <div>
            <button
              className="text-gray-700 hover:text-gray-900 mr-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        {children}
      </div>
    </div>
  );
}

export default SidebarModal;
