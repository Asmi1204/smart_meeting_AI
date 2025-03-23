import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "./firebaseConfig";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import UploadAudio from "./components/UploadAudio";
import RecordAudio from "./components/RecordAudio";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Redirect to login if user is not authenticated */}
        <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <UploadAudio /> : <Navigate to="/login" />} />
        <Route path="/record" element={user ? <RecordAudio /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-950 text-white">
        <LandingPage />
      </div>
    </div>
  );
}
