import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register } from '../auth';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // If the user got redirected here from a protected page,
  // send them back there after logging in. Otherwise go home.
  const goBackTo = location.state?.from || '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Simple form validation
    if (mode === 'register' && username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username.trim(), email, password);
      }
      navigate(goBackTo);
      window.location.reload(); // refresh so the navbar updates
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="page-heading">
          <span className="pill">ACCOUNT</span>
          <h1>{mode === 'login' ? 'Log In' : 'Sign Up'}</h1>
          <p>
            {mode === 'login'
              ? 'Log in to find teammates and send messages.'
              : 'Create an account to get started.'}
          </p>
        </div>

        <form className="panel" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>Username</label>
              <input
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="Your gamer tag"
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />

          {error && <p style={{ color: '#f87171', marginTop: 12 }}>{error}</p>}

          <button className="btn primary full" type="submit">
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
            {mode === 'login' ? (
              <>
                No account?{' '}
                <a
                  href="#"
                  style={{ color: '#a78bfa' }}
                  onClick={event => { event.preventDefault(); setMode('register'); setError(''); }}
                >
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a
                  href="#"
                  style={{ color: '#a78bfa' }}
                  onClick={event => { event.preventDefault(); setMode('login'); setError(''); }}
                >
                  Log in
                </a>
              </>
            )}
          </p>
        </form>
      </div>
    </main>
  );
}
