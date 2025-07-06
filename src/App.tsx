import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContextProvider';
import { ProfileProvider } from './contexts/ProfileContextProvider';
import { FavoritesProvider } from './contexts/FavoritesContextProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProfileCreation from './pages/ProfileCreation';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Testimonials from './pages/Testimonials';
import HowItWorks from './pages/HowItWorks';
import ProtectedRoute from './components/ProtectedRoute';
import StickyFooter from './components/layout/StickyFooter';
import './i18n';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    fontSize: '14px',
                    maxWidth: '90vw'
                  }
                }}
              />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/profile-creation" element={
                  <ProtectedRoute>
                    <ProfileCreation />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Layout />}>
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="search" element={
                    <ProtectedRoute>
                      <Search />
                    </ProtectedRoute>
                  } />
                  <Route path="search-results" element={
                    <ProtectedRoute>
                      <SearchResults />
                    </ProtectedRoute>
                  } />
                  <Route path="profile/:id" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
              <StickyFooter />
            </div>
          </Router>
        </FavoritesProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;