import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import InitialScreen from "./pages/InitialScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import University from "./pages/University";
import LeaveReview from "./pages/LeaveReview";
import Navbar from "./pages/NavBar";
import Profile from "./pages/Profile";
import SavedReviews from "./pages/SavedReviews";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function NavbarWrapper() {
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current?.updateHeight) {
        setNavbarHeight(navbarRef.current.updateHeight());
      }
    };

    updateHeight();
    const handleResize = () => {
      updateHeight();
      setTimeout(updateHeight, 300); // Double check after resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div style={{ paddingTop: `${navbarHeight}px` }}>
        <Routes>
          <Route path="/" element={<InitialScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/university" element={<University />} />
          <Route path="/leaveReview" element={<LeaveReview />} />
          <Route path="/savedReviews" element={<SavedReviews />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="*" element={<AuthRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;