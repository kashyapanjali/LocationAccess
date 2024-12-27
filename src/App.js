import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Otp from "./component/Otp";
import Auth from "./component/Auth";
import LiveLocation from "./component/LiveLocation";
import ForgetPassword from "./component/ForgetPassword";
import ResetPassword from "./component/ResetPassword";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/location" element={<LiveLocation />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
