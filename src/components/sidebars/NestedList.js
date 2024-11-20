import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi'; // Import icons for toggle

const NestedList = ({ items }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ul className="list-none pl-4">
      {items.map((item, index) => (
        <li key={index} className="mb-4">
          <div className="flex justify-between items-center cursor-pointer">
            <span onClick={() => item.children && toggleItem(index)}>
              {item.name}
            </span>
            {item.children && (
              <button
                onClick={() => toggleItem(index)}
                className="text-gray-600 focus:outline-none"
              >
                {openItems[index] ? <FiMinus /> : <FiPlus />}
              </button>
            )}
          </div>

          {item.children && (
            <div
              className={`${
                openItems[index] ? 'block' : 'hidden'
              } pl-4 border-t border-gray-300 mt-2 pt-2`}
            >
              <NestedList items={item.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NestedList;
