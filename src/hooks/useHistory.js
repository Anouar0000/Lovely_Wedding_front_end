// src/hooks/useHistory.js

import { useState, useCallback } from 'react';

const useHistory = (initialState) => {
  // --- THIS IS THE FIX ---
  // 1. We first check if the provided `initialState` is a function.
  const resolvedInitialState = typeof initialState === 'function' 
    ? initialState() 
    : initialState;

  // 2. THEN we use the resolved value to initialize the history array.
  const [history, setHistory] = useState([resolvedInitialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback((action, overwrite = false) => {
    const newState = typeof action === 'function' ? action(history[currentIndex]) : action;

    if (overwrite) {
      const newHistory = [newState];
      setHistory(newHistory);
      setCurrentIndex(0);
    } else {
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    }
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

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
};

export default useHistory;