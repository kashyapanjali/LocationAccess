import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Otp from "./component/Otp";
import Auth from "./component/Auth";
import LiveLocation from "./component/LiveLocation";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/location" element={<LiveLocation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
