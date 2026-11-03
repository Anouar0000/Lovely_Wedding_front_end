import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

/** Accueil chargé en premier — le reste en lazy pour alléger le bundle initial */
import HomePage from './pages/HomePage';

const PhysicalHomePage = lazy(() => import('./pages/PhysicalHomePage'));
const CanvasContainer = lazy(() => import('./pages/CanvasContainer'));
const InvitationsPhysiquePage = lazy(() => import('./pages/InvitationsPhysiquePage'));
const InvitationsDigitalPage = lazy(() => import('./pages/InvitationsDigitalPage'));
const DolceVitaInvitePage = lazy(() => import('./pages/DolceVitaInvitePage'));
const SidiBouSaidInvitePage = lazy(() => import('./pages/SidiBouSaidInvitePage'));
const ClubCapriInvitePage = lazy(() => import('./pages/ClubCapriInvitePage'));
const SakuraKoiInvitePage = lazy(() => import('./pages/SakuraKoiInvitePage'));
const BridgertonInvitePage = lazy(() => import('./pages/BridgertonInvitePage'));
const MajesticWhiteInvitePage = lazy(() => import('./pages/MajesticWhiteInvitePage'));
const SharedDigitalInvitePage = lazy(() => import('./pages/SharedDigitalInvitePage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminInvitesPage = lazy(() => import('./pages/admin/AdminInvitesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('./pages/admin/AdminOrderDetailPage'));
const AdminClientsPage = lazy(() => import('./pages/admin/AdminClientsPage'));
const AdminCatalogPage = lazy(() => import('./pages/admin/AdminCatalogPage'));
const AdminDigitalPricingPage = lazy(() => import('./pages/admin/AdminDigitalPricingPage'));
const DashboardRsvpPage = lazy(() => import('./pages/DashboardRsvpPage'));
const ClientEspacePage = lazy(() => import('./pages/ClientEspacePage'));
const DigitalInviteEditorPage = lazy(() => import('./pages/DigitalInviteEditorPage'));
const InvitationModelPage = lazy(() => import('./pages/InvitationModelPage'));
const DigitalProductDetailPage = lazy(() => import('./pages/DigitalProductDetailPage'));
const DigitalExtrasPage = lazy(() => import('./pages/DigitalExtrasPage'));
const DigitalRecapPage = lazy(() => import('./pages/DigitalRecapPage'));
const DigitalMerciPage = lazy(() => import('./pages/DigitalMerciPage'));
const PersonalizeInvitationPage = lazy(() => import('./pages/PersonalizeInvitationPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const PaymentResultPage = lazy(() => import('./pages/PaymentResultPage'));
const TestPDFDownload = lazy(() => import('./pages/TestPDFDownload'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-[#F7F2EC] font-glacial text-lw-muted">
      Chargement…
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/imprimee" element={<PhysicalHomePage />} />
            <Route path="/canvas" element={<CanvasContainer />} />
            <Route path="/invitations-physique" element={<InvitationsPhysiquePage />} />
            <Route path="/invitations-digital" element={<InvitationsDigitalPage />} />
            <Route path="/invitations-digital/e/:slug" element={<SharedDigitalInvitePage />} />
            <Route path="/invitations-digital/:slug/extras" element={<DigitalExtrasPage />} />
            <Route path="/invitations-digital/:slug/checkout" element={<DigitalRecapPage />} />
            <Route path="/invitations-digital/:slug/merci" element={<DigitalMerciPage />} />
            <Route path="/invitations-digital/:slug" element={<DigitalProductDetailPage />} />
            <Route path="/e/:slug" element={<SharedDigitalInvitePage />} />
            <Route path="/digital-invitation/dolce-vita" element={<DolceVitaInvitePage />} />
            <Route path="/digital-invitation/sidi-bousaid" element={<SidiBouSaidInvitePage />} />
            <Route path="/digital-invitation/club-capri" element={<ClubCapriInvitePage />} />
            <Route path="/digital-invitation/sakura-koi" element={<SakuraKoiInvitePage />} />
            <Route path="/digital-invitation/bridgerton" element={<BridgertonInvitePage />} />
            <Route path="/digital-invitation/majestic-white" element={<MajesticWhiteInvitePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favoris" element={<FavoritesPage />} />
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
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="invitations" element={<AdminInvitesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
              <Route path="clients" element={<AdminClientsPage />} />
              <Route path="catalog" element={<AdminCatalogPage />} />
              <Route path="pricing" element={<AdminDigitalPricingPage />} />
            </Route>

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
          </Suspense>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
