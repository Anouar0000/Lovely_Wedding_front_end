import React, { useState, useEffect } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NestedList = ({ items, resetKey, onClose }) => {
  const [openItems, setOpenItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setOpenItems({});
  }, [resetKey]);

  // This function now uses the uniqueKey to toggle state
  const toggleItem = (uniqueKey) => {
    setOpenItems((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  // This handler is for clicking the text label
  const handleLabelClick = (item, uniqueKey) => {
    if (item.children && item.children.length > 0) {
      toggleItem(uniqueKey); // If it has children, toggle it
    } else {
      navigate('/invitations-physique', { // If not, navigate
        state: { selectedCategory: item.name },
      });
      onClose();
    }
  };

  return (
    <ul className="list-none m-0 p-0">
      {items.map((item, index) => {
        // FIX: We create a truly unique key for each item for both rendering and state
        const uniqueKey = `${item.name}-${index}`;
        const isOpen = openItems[uniqueKey];
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={uniqueKey} className={hasChildren ? 'border-b border-gray-400' : ''}>
            <div className="flex justify-between items-center p-4 hover:bg-gray-50">
              {/* The text span is now the primary clickable element for toggling OR navigating */}
              <span
                className="flex-grow cursor-pointer"
                onClick={() => handleLabelClick(item, uniqueKey)}
              >
                {item.name}
              </span>

              {/* The +/- icon is a dedicated button that ONLY toggles the submenu */}
              {hasChildren && (
                <button
                  className="p-1 ml-2 text-gray-600 focus:outline-none"
                  // It uses the uniqueKey to prevent conflicts
                  onClick={() => toggleItem(uniqueKey)}
                >
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </button>
              )}
            </div>
            {hasChildren && isOpen && (
              <div className="pl-6 pt-2 pb-2 bg-gray-50">
                <NestedList
                  items={item.children}
                  resetKey={resetKey}
                  onClose={onClose}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NestedList;