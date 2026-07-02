import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TeamFinder from './pages/TeamFinder';
import Messages from './pages/Messages';
import GameDiscovery from './pages/GameDiscovery';
import Profile from './pages/Profile';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-team" element={<TeamFinder />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/games" element={<GameDiscovery />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
