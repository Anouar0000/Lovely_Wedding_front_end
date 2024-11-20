import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CanvasContainer from './pages/CanvasContainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas" element={<CanvasContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
