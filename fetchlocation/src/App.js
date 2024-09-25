import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Otp from "./Otp";
import Auth from "./Auth";
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Route for the Otp component */}
          {/* Route for the Auth component */}
          <Route path="/otp" element={<Otp />} />

          {/* Route for the Otp component */}
          <Route path="/home" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
