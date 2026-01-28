import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n"; // Import i18n configuration

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AddRecord from "./pages/AddRecord";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import ChartAnalysis from "./pages/ChartAnalysis";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/add-record" element={<AddRecord />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/charts" element={<ChartAnalysis />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
