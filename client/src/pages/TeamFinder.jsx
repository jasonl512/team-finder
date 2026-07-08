import { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const players = [
  { id: 1, name: 'NightOwl', game: 'Valorant', platform: 'PC', rank: 'Diamond', style: 'Competitive', availability: 'Evening' },
  { id: 2, name: 'Zenya', game: 'Apex Legends', platform: 'PC', rank: 'Platinum', style: 'Chill', availability: 'Flexible' },
  { id: 3, name: 'Eclipse', game: 'Overwatch 2', platform: 'PC', rank: 'Gold', style: 'Casual', availability: 'Evening' },
  { id: 4, name: 'PixelAce', game: 'Valorant', platform: 'PlayStation', rank: 'Platinum', style: 'Competitive', availability: 'Weekend' }
];

function getToken() {
  return localStorage.getItem('token');
}

function getCurrentUser() {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function normalizePost(post) {
  return {
    ...post,
    id: post.id,
    title: post.title || 'Untitled post',
    description: post.description || '',
    game: post.game || 'General',
    username: post.username || 'Unknown',
    members: post.members || '1/5'
  };
}

export default function TeamFinder() {
  const [game, setGame] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [posts, setPosts] = useState([]);
  const [postsStatus, setPostsStatus] = useState('Loading posts from database...');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postGame, setPostGame] = useState('Valorant');

  const currentUser = getCurrentUser();

  const filtered = useMemo(() => {
    return players.filter(player =>
      (game === 'All' || player.game === game) &&
      (platform === 'All' || player.platform === platform)
    );
  }, [game, platform]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const response = await fetch(`${API}/api/posts`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Could not load posts from the server.');
      }

      const data = await response.json();
      setPosts(data.map(normalizePost));
      setPostsStatus('Live posts from database');
    } catch (error) {
      console.error(error);
      setPosts([]);
      setPostsStatus(`Posts could not be loaded: ${error.message}`);
    }
  }

  async function addPost(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please enter both a title and description.');
      return;
    }

    const token = getToken();

    if (!token) {
      alert('Please log in before creating a post.');
      return;
    }

    try {
      const response = await fetch(`${API}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          game: postGame
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post.');
      }

      setPosts(previous => [normalizePost(data), ...previous]);
      setTitle('');
      setDescription('');
      setPostGame('Valorant');
      setPostsStatus('Post created and saved to database');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Could not create post.');
    }
  }

  function isMyPost(post) {
    if (!currentUser) return false;

    return (
      Number(post.user_id) === Number(currentUser.id) ||
      post.username === currentUser.username
    );
  }

  async function deletePost(postId) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      alert('Please log in before deleting a post.');
      return;
    }

    try {
      const response = await fetch(`${API}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post.');
      }

      setPosts(previous => previous.filter(post => post.id !== postId));
      setPostsStatus('Post deleted');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Could not delete post.');
    }
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <span className="pill">TEAM MATCHING</span>
          <h1>Find players and build a team</h1>
          <p>Search for compatible players or create a recruitment post.</p>
        </div>

        <div className="two-column">
          <aside className="panel filters">
            <h3>Search Filters</h3>

            <label>Game</label>
            <select value={game} onChange={event => setGame(event.target.value)}>
              <option>All</option>
              <option>Valorant</option>
              <option>Apex Legends</option>
              <option>Overwatch 2</option>
            </select>

            <label>Platform</label>
            <select value={platform} onChange={event => setPlatform(event.target.value)}>
              <option>All</option>
              <option>PC</option>
              <option>PlayStation</option>
              <option>Xbox</option>
            </select>

            <p className="muted">{filtered.length} player(s) found</p>
          </aside>

          <section>
            <div className="stack">
              {filtered.map(player => (
                <article className="player-card" key={player.id}>
                  <div className="avatar">{player.name.slice(0, 2).toUpperCase()}</div>

                  <div className="grow">
                    <h3>{player.name}</h3>
                    <p>{player.game} · {player.platform} · {player.rank}</p>

                    <div className="tags">
                      <span>{player.style}</span>
                      <span>{player.availability}</span>
                    </div>
                  </div>

                  <button
                    className="btn green"
                    onClick={() => alert(`Team request sent to ${player.name}`)}
                  >
                    Send Request
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="section compact">
          <div className="section-title left">
            <h2>Team Recruitment Board</h2>
            <p>Create a post or request to join an existing team.</p>
            <small className="status">{postsStatus}</small>
          </div>

          <div className="two-column posts-layout">
            <form className="panel" onSubmit={addPost}>
              <h3>Create a Team Post</h3>

              <label>Game</label>
              <select value={postGame} onChange={event => setPostGame(event.target.value)}>
                <option>Valorant</option>
                <option>Apex Legends</option>
                <option>Overwatch 2</option>
                <option>Fortnite</option>
                <option>League of Legends</option>
                <option>Other</option>
              </select>

              <label>Title</label>
              <input
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder="Looking for ranked teammates"
              />

              <label>Description</label>
              <textarea
                rows="5"
                value={description}
                onChange={event => setDescription(event.target.value)}
                placeholder="Rank, schedule, and team expectations..."
              />

              <button className="btn primary full" type="submit">
                Publish Post
              </button>
            </form>

            <div className="stack">
              {posts.length === 0 ? (
                <article className="post-card">
                  <div>
                    <h3>No posts yet</h3>
                    <p>Create the first team recruitment post.</p>
                  </div>
                </article>
              ) : (
                posts.map(post => (
                  <article className="post-card" key={post.id}>
                    <div className="grow">
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                      <small>
                        {post.game} · Posted by {post.username}
                      </small>

                      {isMyPost(post) && (
                        <span className="owner-label">Your post</span>
                      )}
                    </div>

                    <div className="post-actions">
                      {!isMyPost(post) && (
                        <button
                          className="btn green"
                          onClick={() => alert('Join request sent!')}
                        >
                          Join
                        </button>
                      )}

                      {isMyPost(post) && (
                        <button
                          className="btn danger"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
