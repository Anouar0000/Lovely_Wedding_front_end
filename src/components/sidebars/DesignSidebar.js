import React from 'react';
import img1 from '../../assets/images/wedimg1.jpg';
import img2 from '../../assets/images/wedimg2.jpg';
import img3 from '../../assets/images/wedimg3.png';
import img4 from '../../assets/images/wedimg4.jpg';
import img5 from '../../assets/images/wedimg5.jpg';
import img6 from '../../assets/images/wedimg6.jpg';
import img7 from '../../assets/images/wedimg7.jpg';

function DesignSidebar({ onTemplateChange, selectedTemplate, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-11/12 max-w-md bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[90vh]">
        {/* Header with Buttons */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Choose Template</h3>
          <div>
            <button 
              className="text-gray-700 hover:text-gray-900 mr-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        {/* Template Preview Selection */}
        <div className="grid grid-cols-2 gap-4">
          {[img1, img2, img3, img4, img5, img6, img7].map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Template ${index + 1}`}
              className={`cursor-pointer rounded border ${
                selectedTemplate === img ? 'border-blue-500' : 'border-gray-300'
              } hover:opacity-80`}
              onClick={() => onTemplateChange(img)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesignSidebar;
