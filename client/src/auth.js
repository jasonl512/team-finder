// Small helper for talking to the backend and remembering who is logged in.
// The token and user are saved in localStorage so they survive page refreshes.

const API = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export function getUser() {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}

export async function login(email, password) {
  const res = await fetch(API + '/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed.');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export async function register(username, email, password) {
  const res = await fetch(API + '/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed.');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
