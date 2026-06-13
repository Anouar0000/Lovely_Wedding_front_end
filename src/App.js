import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CanvasContainer from './pages/CanvasContainer';
import InvitationsPhysiquePage from './pages/InvitationsPhysiquePage';
import InvitationsDigitalPage from './pages/InvitationsDigitalPage';
import DolceVitaInvitePage from './pages/DolceVitaInvitePage';
import SidiBouSaidInvitePage from './pages/SidiBouSaidInvitePage';
import SharedDigitalInvitePage from './pages/SharedDigitalInvitePage';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DigitalInviteEditorPage from './pages/DigitalInviteEditorPage';
import InvitationModelPage from "./pages/InvitationModelPage";
import PersonalizeInvitationPage from "./pages/PersonalizeInvitationPage";
import TestPDFDownload from './pages/TestPDFDownload';



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/canvas" element={<CanvasContainer />} />
          <Route path="/invitations-physique" element={<InvitationsPhysiquePage />} />
          <Route path="/invitations-digital" element={<InvitationsDigitalPage />} />
          <Route path="/e/:slug" element={<SharedDigitalInvitePage />} />
          <Route path="/invitations-digital/e/:slug" element={<SharedDigitalInvitePage />} />
          <Route path="/digital-invitation/dolce-vita" element={<DolceVitaInvitePage />} />
          <Route path="/digital-invitation/sidi-bousaid" element={<SidiBouSaidInvitePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/invitations/new"
            element={
              <ProtectedRoute>
                <DigitalInviteEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/invitations/:id/edit"
            element={
              <ProtectedRoute>
                <DigitalInviteEditorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/invitation-model/:modelName" element={<InvitationModelPage />} />
          <Route path="/personalize" element={<PersonalizeInvitationPage />} />
          <Route path="/pdf-test" element={<TestPDFDownload />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
