import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialScreen from "./pages/InitialScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import University from "./pages/University";
import UniversityList from "./pages/UniversityList";
import Navbar from "./pages/NavBar";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<InitialScreen />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signUp" element={<SignUp />} />
          <Route path="/university" element={<University />} />
          <Route path="/universityList" element={<UniversityList />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
