/** @format */

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Otp from "./component/Otp";
import Auth from "./component/Auth";
import LiveLocation from "./component/LiveLocation";
import ForgetPassword from "./component/ForgetPassword";
import ResetPassword from "./component/ResetPassword";
import PrivateRoute from "./component/PrivateRoute";

function App() {
	return (
		<Router>
			<div className="app">
				<Routes>
					<Route path="/" element={<Auth />} />
					<Route path="/otp" element={<Otp />} />
					{/* <Route path="/location" element={<LiveLocation />} /> */}
					<Route path="/forget-password" element={<ForgetPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					{/* Private Route for /location */}
					<Route element={<PrivateRoute />}>
						<Route path="/location" element={<LiveLocation />} />
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
