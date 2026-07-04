import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../auth';

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
    window.location.reload(); // refresh so all pages see the logged-out state
  }

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="brand"><span className="logo">🎮</span><span>TEAM FINDER</span></NavLink>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/games">Game Discovery</NavLink>

          {/* Only show these when logged in */}
          {user && <NavLink to="/find-team">Find Team</NavLink>}
          {user && <NavLink to="/messages">Messages</NavLink>}
        </div>

        <div className="nav-links">
          {user ? (
            <>
              <span>👤 {user.username}</span>
              <a href="#" onClick={event => { event.preventDefault(); handleLogout(); }}>Log out</a>
            </>
          ) : (
            <NavLink to="/login" className="btn primary" style={{ padding: '8px 16px' }}>Log In</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
