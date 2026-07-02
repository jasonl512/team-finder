import { useMemo, useState } from 'react';

const starterPlayers = [
  { id: 1, name: 'NightOwl', game: 'Valorant', platform: 'PC', rank: 'Diamond', style: 'Competitive', availability: 'Evening' },
  { id: 2, name: 'Zenya', game: 'Apex Legends', platform: 'PC', rank: 'Platinum', style: 'Chill', availability: 'Flexible' },
  { id: 3, name: 'Eclipse', game: 'Overwatch 2', platform: 'PC', rank: 'Gold', style: 'Casual', availability: 'Evening' },
  { id: 4, name: 'PixelAce', game: 'Valorant', platform: 'PlayStation', rank: 'Platinum', style: 'Competitive', availability: 'Weekend' }
];

export default function TeamFinder() {
  const [game, setGame] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Need 2 Valorant players',
      description: 'Diamond+, PC, weekdays after 8 PM',
      members: '3/5',
      isOwner: false
    },
    {
      id: 2,
      title: 'Apex weekend squad',
      description: 'Friendly Platinum team, no toxicity',
      members: '2/3',
      isOwner: false
    }
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const filtered = useMemo(
    () =>
      starterPlayers.filter(
        player =>
          (game === 'All' || player.game === game) &&
          (platform === 'All' || player.platform === platform)
      ),
    [game, platform]
  );

  function addPost(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please enter both a title and description.');
      return;
    }

    setPosts(previous => [
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        members: '1/5',
        isOwner: true
      },
      ...previous
    ]);

    setTitle('');
    setDescription('');
  }

  function deletePost(postId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (!confirmed) return;

    setPosts(previous => previous.filter(post => post.id !== postId));
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="pill">TEAM MATCHING</span>
            <h1>Find players and build a team</h1>
            <p>Search for compatible players or create a recruitment post.</p>
          </div>
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
            <select
              value={platform}
              onChange={event => setPlatform(event.target.value)}
            >
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
                  <div className="avatar">
                    {player.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="grow">
                    <h3>{player.name}</h3>
                    <p>
                      {player.game} · {player.platform} · {player.rank}
                    </p>

                    <div className="tags">
                      <span>{player.style}</span>
                      <span>{player.availability}</span>
                    </div>
                  </div>

                  <button
                    className="btn green"
                    onClick={() =>
                      alert(`Team request sent to ${player.name}`)
                    }
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
          </div>

          <div className="two-column posts-layout">
            <form className="panel" onSubmit={addPost}>
              <h3>Create a Team Post</h3>

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
                placeholder="Game, rank, schedule, and team expectations..."
              />

              <button className="btn primary full" type="submit">
                Publish Post
              </button>
            </form>

            <div className="stack">
              {posts.map(post => (
                <article className="post-card" key={post.id}>
                  <div className="grow">
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <small>{post.members} members</small>

                    {post.isOwner && (
                      <span className="owner-label">Your post</span>
                    )}
                  </div>

                  <div className="post-actions">
                    {!post.isOwner && (
                      <button
                        className="btn green"
                        onClick={() => alert('Join request sent!')}
                      >
                        Join
                      </button>
                    )}

                    {post.isOwner && (
                      <button
                        className="btn danger"
                        onClick={() => deletePost(post.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
