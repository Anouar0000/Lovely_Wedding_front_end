// src/hooks/useUnsafeZoneCollision.js

import { useState, useEffect, useCallback } from 'react';

const findTextBoxNode = (id) => {
  return document.querySelector(`[data-box-id='${id}']`);
};

// --- Define specific tolerances for each zone ID ---
const COLLISION_TOLERANCES = {
  top: 18,    // 3px of forgiveness for the top zone
  right: 36,  // 5px of forgiveness for the right zone
  bottom: 14, // 0px of forgiveness for the bottom zone
  left: 6,   // 0px of forgiveness for the left zone
  default: 0 // A fallback for any other zone
};


export const useUnsafeZoneCollision = (model, cardContent, currentCard, contentContainerRef) => {
  const [activeUnsafeZones, setActiveUnsafeZones] = useState(new Set());

  const checkAllCollisions = useCallback(() => {
    // --- THIS IS THE FIX ---
    // If the current card is the back, immediately clear any active zones and stop.
    if (currentCard === 'back') {
      if (activeUnsafeZones.size > 0) setActiveUnsafeZones(new Set());
      return;
    }

    const currentUnsafeZones = model?.unsafeZones || [];
    const currentTextBoxes = cardContent[currentCard]?.textBoxes || [];

    if (currentUnsafeZones.length === 0 || !contentContainerRef.current) {
      if (activeUnsafeZones.size > 0) setActiveUnsafeZones(new Set());
      return;
    }

    const containerWidth = contentContainerRef.current.clientWidth;
    const containerHeight = contentContainerRef.current.clientHeight;
    if (containerWidth === 0 || containerHeight === 0) return;
    
    const newActiveZones = new Set();

    for (const box of currentTextBoxes) {
      const node = findTextBoxNode(box.id);
      const boxHeight = node ? node.clientHeight : 20;

      const boxRect = {
        left: box.position.x,
        top: box.position.y,
        right: box.position.x + box.width,
        bottom: box.position.y + boxHeight,
      };

      for (const zone of currentUnsafeZones) {
        const zoneRect = {
          left: (zone.x / 100) * containerWidth,
          top: (zone.y / 100) * containerHeight,
          right: ((zone.x + zone.width) / 100) * containerWidth,
          bottom: ((zone.y + zone.height) / 100) * containerHeight,
        };
        
        const isOverlapping = (
            boxRect.left < zoneRect.right && 
            boxRect.right > zoneRect.left &&
            boxRect.top < zoneRect.bottom && 
            boxRect.bottom > zoneRect.top
        );

        if (isOverlapping) {
          const overlapX = Math.max(0, Math.min(boxRect.right, zoneRect.right) - Math.max(boxRect.left, zoneRect.left));
          const overlapY = Math.max(0, Math.min(boxRect.bottom, zoneRect.bottom) - Math.max(boxRect.top, zoneRect.top));
          
          const tolerance = COLLISION_TOLERANCES[zone.id] || COLLISION_TOLERANCES.default;

          let hasCollision = false;
          switch(zone.id) {
            case 'top':
            case 'bottom':
              if (overlapY > tolerance) hasCollision = true;
              break;
            case 'left':
            case 'right':
              if (overlapX > tolerance) hasCollision = true;
              break;
            default:
              if (overlapX > tolerance && overlapY > tolerance) hasCollision = true;
              break;
          }

          if (hasCollision) {
            newActiveZones.add(zone.id);
          }
        }
      }
    }

    if (newActiveZones.size !== activeUnsafeZones.size || ![...newActiveZones].every(id => activeUnsafeZones.has(id))) {
      setActiveUnsafeZones(newActiveZones);
    }

  }, [model?.unsafeZones, cardContent, currentCard, contentContainerRef, activeUnsafeZones]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAllCollisions();
    }, 50);

    return () => clearTimeout(timeoutId);
    
  }, [model, cardContent, currentCard, checkAllCollisions]);

  return activeUnsafeZones;
};