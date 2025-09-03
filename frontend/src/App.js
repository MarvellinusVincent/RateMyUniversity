import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useRef, useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Navbar from "./pages/NavBar";
import InitialScreen from "./pages/InitialScreen";
import SearchResults from "./pages/SearchResults";
import University from "./pages/University";
import LeaveReview from "./pages/LeaveReview";
import SavedReviews from "./pages/SavedReviews";
import AddSchool from "./pages/AddSchool";
import { HelmetProvider } from "react-helmet-async";

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
    <>
      <Navbar ref={navbarRef} />
      <div style={{ 
        paddingTop: `${navbarHeight}px`,
        minHeight: `calc(100vh - ${navbarHeight}px)`
      }}>
        <Routes>
          <Route path="/" element={<InitialScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/university/:id" element={<University />} />
          <Route path="/search/university" element={<SearchResults />} />
          <Route path="/addReview/:universityId" element={<LeaveReview />} />
          <Route path="/savedReviews" element={<SavedReviews />} />
          <Route path="/addSchool" element={<AddSchool />} />
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
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="*" element={<AuthRoutes />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

// This i a test to see if the extension works in what ive done. 

export default App;