import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RegisterLogin from "./pages/RegisterLogin";
import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoutes";
function App() {
  const token = localStorage.getItem('token');
  // console.log(token)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/todos" />} />
        <Route path="/todos" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/registerorlogin" element={<PublicRoute><RegisterLogin /></PublicRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
