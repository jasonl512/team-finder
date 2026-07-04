import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import TeamFinder from './pages/TeamFinder';
import Messages from './pages/Messages';
import GameDiscovery from './pages/GameDiscovery';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GameDiscovery />} />
        <Route path="/login" element={<Login />} />

        {/* Pages that require login */}
        <Route path="/find-team" element={<ProtectedRoute><TeamFinder /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
