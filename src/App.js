import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhysicalHomePage from './pages/PhysicalHomePage';
import CanvasContainer from './pages/CanvasContainer';
import InvitationsPhysiquePage from './pages/InvitationsPhysiquePage';
import InvitationsDigitalPage from './pages/InvitationsDigitalPage';
import DolceVitaInvitePage from './pages/DolceVitaInvitePage';
import SidiBouSaidInvitePage from './pages/SidiBouSaidInvitePage';
import ClubCapriInvitePage from './pages/ClubCapriInvitePage';
import SakuraKoiInvitePage from './pages/SakuraKoiInvitePage';
import BridgertonInvitePage from './pages/BridgertonInvitePage';
import MajesticWhiteInvitePage from './pages/MajesticWhiteInvitePage';
import SharedDigitalInvitePage from './pages/SharedDigitalInvitePage';
import { AuthProvider } from './components/auth/AuthProvider';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import DashboardRsvpPage from './pages/DashboardRsvpPage';
import ClientEspacePage from './pages/ClientEspacePage';
import DigitalInviteEditorPage from './pages/DigitalInviteEditorPage';
import InvitationModelPage from "./pages/InvitationModelPage";
import PersonalizeInvitationPage from "./pages/PersonalizeInvitationPage";
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PaymentResultPage from './pages/PaymentResultPage';
import TestPDFDownload from './pages/TestPDFDownload';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/imprimee" element={<PhysicalHomePage />} />
            <Route path="/canvas" element={<CanvasContainer />} />
            <Route path="/invitations-physique" element={<InvitationsPhysiquePage />} />
            <Route path="/invitations-digital" element={<InvitationsDigitalPage />} />
            <Route path="/e/:slug" element={<SharedDigitalInvitePage />} />
            <Route path="/invitations-digital/e/:slug" element={<SharedDigitalInvitePage />} />
            <Route path="/digital-invitation/dolce-vita" element={<DolceVitaInvitePage />} />
            <Route path="/digital-invitation/sidi-bousaid" element={<SidiBouSaidInvitePage />} />
            <Route path="/digital-invitation/club-capri" element={<ClubCapriInvitePage />} />
            <Route path="/digital-invitation/sakura-koi" element={<SakuraKoiInvitePage />} />
            <Route path="/digital-invitation/bridgerton" element={<BridgertonInvitePage />} />
            <Route path="/digital-invitation/majestic-white" element={<MajesticWhiteInvitePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/result" element={<PaymentResultPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route
              path="/espace-client"
              element={
                <ProtectedRoute>
                  <ClientEspacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/espace-client/invitations/:id/rsvp"
              element={
                <ProtectedRoute>
                  <DashboardRsvpPage clientMode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/invitations/new"
              element={
                <ProtectedRoute requireAdmin>
                  <DigitalInviteEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/invitations/:id/edit"
              element={
                <ProtectedRoute requireAdmin>
                  <DigitalInviteEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/invitations/:id/rsvp"
              element={
                <ProtectedRoute requireAdmin>
                  <DashboardRsvpPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/invitations/:id/preview"
              element={
                <ProtectedRoute requireAdmin>
                  <SharedDigitalInvitePage allowDraft previewMode lookupById />
                </ProtectedRoute>
              }
            />
            <Route path="/invitation-model/:modelName" element={<InvitationModelPage />} />
            <Route path="/personalize" element={<PersonalizeInvitationPage />} />
            <Route path="/pdf-test" element={<TestPDFDownload />} />
            <Route path="/:slug" element={<SharedDigitalInvitePage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
