import React, { useState } from 'react';
import Sidebar from '../components/sidebars/Sidebar';
import InvitationCanvas from '../components/canvas/InvitationCanvas';
import { useNavigate } from 'react-router-dom';
import img from '../assets/images/wedimg1.jpg';

function CanvasContainer() {
  const navigate = useNavigate(); // Hook for navigation

  const [fields, setFields] = useState({
    brideName: { text: "Bride's Name", fontSize: 16, bold: false, italic: false, fontStyle: 'Arial' },
    groomName: { text: "Groom's Name", fontSize: 16, bold: false, italic: false, fontStyle: 'Arial' },
    date: { text: "Date", fontSize: 16, bold: false, italic: false, fontStyle: 'Arial' },
    location: { text: "Location", fontSize: 16, bold: false, italic: false, fontStyle: 'Arial' },
  });

  const [selectedTemplate, setSelectedTemplate] = useState(img);

  const handleFieldChange = (field, property, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [field]: {
        ...prevFields[field],
        [property]: value,
      },
    }));
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3">
        <button 
          onClick={() => navigate('/')} 
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Back to Homepage
        </button>
        <h1 className="text-lg font-bold">Lovely Wedding</h1>
      </header>

      {/* Main Content */}
      <div className="mt-[40] pt-[52px] flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <Sidebar 
          fields={fields} 
          onFieldChange={handleFieldChange} 
          onTemplateChange={setSelectedTemplate} 
        />

        {/* Canvas Section */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 pt-[38px]">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-full max-h-[90vh]">
            <InvitationCanvas 
              fields={fields} 
              onFieldChange={handleFieldChange} 
              template={selectedTemplate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasContainer;
