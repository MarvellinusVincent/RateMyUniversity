import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useRef, useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Navbar from "./pages/NavBar";
import Footer from "./pages/Footer";
import InitialScreen from "./pages/InitialScreen";
import SearchResults from "./pages/SearchResults";
import University from "./pages/University";
import LeaveReview from "./pages/LeaveReview";
import SavedReviews from "./pages/SavedReviews";
import AddSchool from "./pages/AddSchool";
import AboutUs from "./pages/AboutUs";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CopyrightPolicy from "./pages/CopyrightPolicy";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import { HelmetProvider } from "react-helmet-async";
import ResetPassword from "./pages/ResetPassword";

function NavbarWrapper() {
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  
  useEffect(() => {
    if (!navbarRef.current) return;
    const updateHeight = () => {
      const height = navbarRef.current.offsetHeight;
      setNavbarHeight(height);
    };
    updateHeight();
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setNavbarHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(navbarRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar ref={navbarRef} />
      <div 
        style={{
          paddingTop: `${navbarHeight}px`,
          minHeight: `calc(100vh - ${navbarHeight}px)`,
        }}
        className="flex flex-col flex-1"
      >
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<InitialScreen />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/university/:id" element={<University />} />
            <Route path="/search/university" element={<SearchResults />} />
            <Route path="/addReview/:universityId" element={<LeaveReview />} />
            <Route path="/savedReviews" element={<SavedReviews />} />
            <Route path="/addSchool" element={<AddSchool />} />

            {/* Footer Links */} 
         
            <Route path="/about" element={<AboutUs />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/copyright" element={<CopyrightPolicy />} />
            <Route path="/faq" element={<FAQ />} />   
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function AuthRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <NavbarWrapper /> : null;
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="*" element={<AuthRoutes />} />
          </Routes>
        </Router>
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </HelmetProvider>
  );
}


export default App;