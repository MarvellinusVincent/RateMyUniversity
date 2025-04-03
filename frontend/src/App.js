import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import InitialScreen from "./pages/InitialScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import University from "./pages/University";
import LeaveReview from "./pages/LeaveReview";
import Navbar from "./pages/NavBar";
import Profile from "./pages/Profile";
import SavedReviews from "./pages/SavedReviews";
import { UserProvider } from "./contexts/UserContexts";

function App() {
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current && navbarRef.current.getHeight) {
        setNavbarHeight(navbarRef.current.getHeight());
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
    <UserProvider>
      <Router>
        <Navbar ref={navbarRef} />
        <div 
          className="w-full bg-gray-50" // Added bg-gray-50 for subtle background
          style={{
            paddingTop: `calc(${navbarHeight}px + 1.5rem)`, // Added 1.5rem (24px) extra space
            minHeight: `calc(100vh - ${navbarHeight}px + env(safe-area-inset-top))`,
            boxSizing: 'border-box'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> {/* Container for content */}
            <Routes>
              <Route path="/" element={<InitialScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/university" element={<University />} />
              <Route path="/leaveReview" element={<LeaveReview />} />
              <Route path="/savedReviews" element={<SavedReviews />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;