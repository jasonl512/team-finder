import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="brand"><span className="logo">🎮</span><span>TEAM FINDER</span></NavLink>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/find-team">Find Team</NavLink>
          <NavLink to="/messages">Messages</NavLink>
          <NavLink to="/games">Game Discovery</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>
      </div>
    </nav>
  );
}
