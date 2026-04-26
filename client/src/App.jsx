import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BrowseGigsPage from './pages/gigs/BrowseGigsPage';
import GigDetailPage from './pages/gigs/GigDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Protected Pages (Dashboard)
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import CreateGigPage from './pages/dashboard/CreateGigPage';
import MyGigsPage from './pages/dashboard/MyGigsPage';
import MyOrdersPage from './pages/dashboard/MyOrdersPage';
import OrderDetailsPage from './pages/dashboard/OrderDetailsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import MessagesPage from './pages/dashboard/MessagesPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import SettingsPage from './pages/dashboard/SettingsPage';

// Minimal App component setup
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a35',
            color: '#fff',
            border: '1px solid #2d2d50',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#fff' } }
        }} 
      />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/gigs" element={<BrowseGigsPage />} />
          <Route path="/gigs/:id" element={<GigDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            
            {/* Freelancer Only Routes */}
            <Route path="create-gig" element={
              <ProtectedRoute roles={['freelancer']}>
                <CreateGigPage />
              </ProtectedRoute>
            } />
            <Route path="edit-gig/:id" element={
              <ProtectedRoute roles={['freelancer']}>
                <CreateGigPage /> {/* Assuming we reuse CreateGigPage for editing */}
              </ProtectedRoute>
            } />
            <Route path="my-gigs" element={
              <ProtectedRoute roles={['freelancer']}>
                <MyGigsPage />
              </ProtectedRoute>
            } />

            {/* Client/Freelancer Routes */}
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Fallback for undefined dashboard routes */}
            <Route path="*" element={<div className="p-8 text-center">Page Under Construction</div>} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
