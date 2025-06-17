import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CanvasContainer from './pages/CanvasContainer';
import InvitationsPhysiquePage from './pages/InvitationsPhysiquePage';
import InvitationModelPage from "./pages/InvitationModelPage";
import PersonalizeInvitationPage from "./pages/PersonalizeInvitationPage";
import TestPDFDownload from './pages/TestPDFDownload';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas" element={<CanvasContainer />} />
        <Route path="/invitations-physique" element={<InvitationsPhysiquePage />} />
        <Route path="/invitation-model/:modelName" element={<InvitationModelPage />} />
        <Route path="/personalize" element={<PersonalizeInvitationPage />} />
        <Route path="/pdf-test" element={<TestPDFDownload />} />
      </Routes>
    </Router>
  );
}

export default App;
