// Import React for building the component
import React from 'react';

// Import React Router components for navigation
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';

// Import Lucide icons for UI elements
import { Tent, BookOpen, Menu, X } from 'lucide-react';

// Import Framer Motion for animations
import { motion, AnimatePresence } from 'framer-motion';

// Import page components
import HomePage from './components/HomePage';
import BookingsPage from './components/BookingsPage';

// Import main stylesheet
import './App.scss';

// Custom NavLink component that adds active class for styling
const CustomNavLink = ({ to, children, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};

// Main app content component
const AppContent = () => {
  // State for controlling mobile navigation menu
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  // Toggle mobile navigation menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    // Main container for the application
    <div className="app-container">
      {/* Header section with navigation */}
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            {/* Brand logo and name with animation */}
            <NavLink to="/" className="navbar-brand d-flex align-items-center">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Tent size={28} className="me-2 text-primary" />
              </motion.div>
              <span className="brand-text">GlampEscape</span>
            </NavLink>

            {/* Mobile menu toggle button */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNav}
              aria-expanded={isNavOpen ? "true" : "false"}
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Navigation menu with animation */}
            <AnimatePresence>
              <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
                <motion.ul
                  className="navbar-nav ms-auto"
                  initial={isNavOpen ? { opacity: 0, height: 0 } : false}
                  animate={isNavOpen ? { opacity: 1, height: 'auto' } : false}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Home navigation item */}
                  <li className="nav-item">
                    <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                      <CustomNavLink to="/" onClick={() => setIsNavOpen(false)}>
                        Home
                      </CustomNavLink>
                    </motion.div>
                  </li>
                  {/* Bookings navigation item */}
                  <li className="nav-item">
                    <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                      <CustomNavLink to="/bookings" onClick={() => setIsNavOpen(false)}>
                        <BookOpen size={16} className="me-1" /> My Bookings
                      </CustomNavLink>
                    </motion.div>
                  </li>
                </motion.ul>
              </div>
            </AnimatePresence>
          </div>
        </nav>
      </header>

      {/* Main content area with page routing */}
      <main className="app-main container">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Home page route with animation */}
            <Route path="/" element={
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HomePage />
              </motion.div>
            } />
            {/* Bookings page route with animation */}
            <Route path="/bookings" element={
              <motion.div
                key="bookings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookingsPage />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer section */}
      <footer className="app-footer">
        <div className="container">
          <div className="row">
            {/* Footer brand and description */}
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <Tent size={24} className="me-2 text-primary" />
                <span className="brand-text">GlampEscape</span>
              </div>
              <p className="footer-text">Experience nature in luxury with our unique glamping destinations worldwide.</p>
            </div>
            {/* Footer navigation and copyright */}
            <div className="col-md-6 text-md-end">
              <div className="footer-links">
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/bookings" className="footer-link">My Bookings</Link>
              </div>
              <p className="copyright">© {new Date().getFullYear()} GlampEscape. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component with Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Export the App component
export default App;