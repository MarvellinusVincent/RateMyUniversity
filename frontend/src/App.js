import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialScreen from "./pages/InitialScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import University from "./pages/University";
import LeaveReview from "./pages/LeaveReview";
import Navbar from "./pages/NavBar";
import Profile from "./pages/Profile"
import { UserProvider } from "./contexts/UserContexts";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<InitialScreen />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signUp" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/university" element={<University />} />
          <Route path="/leaveReview" element={<LeaveReview />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
