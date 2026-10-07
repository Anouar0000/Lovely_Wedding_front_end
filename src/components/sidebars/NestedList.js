import React, { useState, useEffect } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NestedList = ({ items, resetKey, onClose }) => {
  const [openItems, setOpenItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setOpenItems({});
  }, [resetKey]);

  const toggleItem = (uniqueKey) => {
    setOpenItems((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  const handleLabelClick = (item, uniqueKey) => {
    if (item.children && item.children.length > 0) {
      toggleItem(uniqueKey);
      return;
    }

    const targetPath = item.path || '/invitations-physique';
    navigate(targetPath, {
      state: item.category ? { selectedCategory: item.category } : undefined,
    });
    onClose();
  };

  return (
    <ul className="list-none m-0 p-0">
      {items.map((item, index) => {
        const uniqueKey = `${item.name}-${index}`;
        const isOpen = openItems[uniqueKey];
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={uniqueKey} className={hasChildren ? 'border-b border-gray-400' : ''}>
            <div className="flex justify-between items-center p-4 hover:bg-gray-50">
              <span
                className="flex-grow cursor-pointer"
                onClick={() => handleLabelClick(item, uniqueKey)}
              >
                {item.name}
              </span>

              {hasChildren && (
                <button
                  type="button"
                  className="p-1 ml-2 text-gray-600 focus:outline-none"
                  onClick={() => toggleItem(uniqueKey)}
                  aria-label={isOpen ? 'Replier' : 'Déplier'}
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
