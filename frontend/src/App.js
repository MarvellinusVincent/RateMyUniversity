import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialScreen from "./pages/InitialScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import University from "./pages/University";
import Navbar from "./pages/NavBar";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<InitialScreen />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signUp" element={<SignUp />} />
        <Route path="/university" element={<University />} />
      </Routes>
    </Router>
  );
}

export default App;
