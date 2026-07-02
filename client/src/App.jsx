import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TeamFinder from './pages/TeamFinder';
import Messages from './pages/Messages';
import GameDiscovery from './pages/GameDiscovery';
export default function App(){return <><Navbar/><Routes><Route path='/' element={<Home/>}/><Route path='/find-team' element={<TeamFinder/>}/><Route path='/messages' element={<Messages/>}/><Route path='/games' element={<GameDiscovery/>}/></Routes></>}
