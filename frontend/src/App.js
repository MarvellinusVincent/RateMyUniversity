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
      setTimeout(updateHeight, 300);
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