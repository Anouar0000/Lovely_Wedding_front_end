import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

function ExpandableSections() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    { title: "Description", content: "Voici les détails de la description." },
    { title: "Délai de livraison", content: "La livraison prend généralement 5 à 7 jours ouvrables." },
    { title: "Option accompagnement", content: "Choisissez des options supplémentaires pour accompagner votre commande." },
  ];

  return (
    <div className="px-4 mt-16 mb-8">
      {sections.map((section) => (
        <div key={section.title} className="border-b border-gray-100 bg-white py-3">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(section.title)}
          >
            <div className="flex items-center space-x-2 px-4 py-2">
              {expandedSection === section.title ? (
                <FiMinus className="text-black" />
              ) : (
                <FiPlus className="text-black" />
              )}
              <span className="text-sm font-medium font-urbanist text-black">{section.title}</span>
            </div>

            {/* Optional: Show arrow for clarity */}
            {expandedSection === section.title && (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>

          {expandedSection === section.title && (
            <div className=" px-4 mt-2 text-sm text-gray-600">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExpandableSections;
