import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from "./contexts/Authentication";
import InitialScreen from "./pages/InitialScreen";

function App() {
  return (
    <Router>
      <Authentication>
        <Routes>
          <Route path = "/" element = {<InitialScreen />} />
        </Routes>
      </Authentication>
    </Router>
  )
}

export default App;
