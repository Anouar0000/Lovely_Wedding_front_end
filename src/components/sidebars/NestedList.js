import React, { useState, useEffect } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NestedList = ({ items, resetKey }) => {
  const [openItems, setOpenItems] = useState({});
    const navigate = useNavigate();

  useEffect(() => {
    // Close all open menus when resetKey changes (sidebar closes)
    setOpenItems({});
  }, [resetKey]);

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ul className="list-none pl-4">
      {items.map((item, index) => {
        const key = item.name + '-' + index;
        const isOpen = openItems[key];

        const handleClick = () => {
          if (item.children && item.children.length > 0) {
            toggleItem(key); // Expand/collapse
          } else {
            const path = `/invitations-physique/`;
            navigate(path);
          }
        };

        return (
          <li key={key} className="mb-4">
            <div className="flex justify-between items-center cursor-pointer">
              <span onClick={handleClick}>
                {item.name}
              </span>
              {item.children && (
                <button
                  onClick={() => toggleItem(key)}
                  className="text-gray-600 focus:outline-none"
                >
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </button>
              )}
            </div>

            {item.children && isOpen && (
              <div className="pl-4 border-l border-gray-300 mt-2 ml-2">
                <NestedList items={item.children} resetKey={resetKey} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NestedList;
