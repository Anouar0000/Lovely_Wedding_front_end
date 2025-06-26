// src/hooks/useHistory.js

import { useState, useCallback } from 'react';

const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // The current state is just the entry at the current index
  const state = history[currentIndex];

  // Our new setState function that manages history
  const setState = useCallback((newState) => {
    // If we've undone some steps, we need to "fork" the history
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Add the new state to the end
    newHistory.push(newState);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  // Booleans to disable/enable the buttons
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
};

export default useHistory;