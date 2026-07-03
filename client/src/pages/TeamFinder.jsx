import { useMemo, useState } from 'react';

const starterPlayers = [
  { id: 1, name: 'NightOwl', games: ['Valorant', 'Overwatch 2'], platform: 'PC', rank: 'Diamond', style: 'Competitive', availability: 'Evening' },
  { id: 2, name: 'Zenya', games: ['Apex Legends', 'Fortnite'], platform: 'PC', rank: 'Platinum', style: 'Chill', availability: 'Flexible' },
  { id: 3, name: 'Eclipse', games: ['Overwatch 2', 'League of Legends'], platform: 'PC', rank: 'Gold', style: 'Casual', availability: 'Evening' },
  { id: 4, name: 'PixelAce', games: ['Valorant', 'Fortnite'], platform: 'PlayStation', rank: 'Platinum', style: 'Competitive', availability: 'Weekend' },
  { id: 5, name: 'Nova', games: ['Minecraft', 'League of Legends'], platform: 'Xbox', rank: 'Unranked', style: 'Chill', availability: 'Weekend' }
];

const availableGames = [
  'Valorant',
  'Apex Legends',
  'Overwatch 2',
  'Fortnite',
  'League of Legends',
  'Minecraft'
];

export default function TeamFinder() {
  const [playerSearch, setPlayerSearch] = useState('');
  const [gameSearch, setGameSearch] = useState('');
  const [selectedGames, setSelectedGames] = useState([]);
  const [platform, setPlatform] = useState('All');

  const [posts, setPosts] = useState([
    { id: 1, title: 'Need 2 Valorant players', description: 'Diamond+, PC, weekdays after 8 PM', members: '3/5', isOwner: false },
    { id: 2, title: 'Apex weekend squad', description: 'Friendly Platinum team, no toxicity', members: '2/3', isOwner: false }
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const visibleGameOptions = useMemo(() => {
    const query = gameSearch.trim().toLowerCase();
    return availableGames.filter(game => game.toLowerCase().includes(query));
  }, [gameSearch]);

  const filteredPlayers = useMemo(() => {
    const search = playerSearch.trim().toLowerCase();

    return starterPlayers.filter(player => {
      const matchesPlayerSearch =
        !search ||
        player.name.toLowerCase().includes(search) ||
        player.games.some(game => game.toLowerCase().includes(search));

      const matchesGames =
        selectedGames.length === 0 ||
        selectedGames.some(game => player.games.includes(game));

      const matchesPlatform =
        platform === 'All' || player.platform === platform;

      return matchesPlayerSearch && matchesGames && matchesPlatform;
    });
  }, [playerSearch, selectedGames, platform]);

  function toggleGame(game) {
    setSelectedGames(previous =>
      previous.includes(game)
        ? previous.filter(item => item !== game)
        : [...previous, game]
    );
  }

  function clearFilters() {
    setPlayerSearch('');
    setGameSearch('');
    setSelectedGames([]);
    setPlatform('All');
  }

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
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    setPosts(previous => previous.filter(post => post.id !== postId));
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <span className="pill">TEAM MATCHING</span>
          <h1>Find players and build a team</h1>
          <p>Search by player name, select multiple games, or create a recruitment post.</p>
        </div>

        <div className="two-column">
          <aside className="panel filters advanced-filters">
            <div className="filter-heading-row">
              <h3>Search Filters</h3>
              <button className="filter-clear-button" type="button" onClick={clearFilters}>Clear</button>
            </div>

            <label>Search Player or Game</label>
            <input
              value={playerSearch}
              onChange={event => setPlayerSearch(event.target.value)}
              placeholder="Username or game..."
            />

            <label>Games</label>
            <input
              value={gameSearch}
              onChange={event => setGameSearch(event.target.value)}
              placeholder="Search game options..."
            />

            <div className="game-checkbox-list">
              {visibleGameOptions.map(game => (
                <label className="game-checkbox-row" key={game}>
                  <input
                    type="checkbox"
                    checked={selectedGames.includes(game)}
                    onChange={() => toggleGame(game)}
                  />
                  <span>{game}</span>
                </label>
              ))}

              {visibleGameOptions.length === 0 && (
                <p className="no-filter-results">No matching games.</p>
              )}
            </div>

            {selectedGames.length > 0 && (
              <div className="selected-filter-tags">
                {selectedGames.map(game => (
                  <button type="button" key={game} onClick={() => toggleGame(game)}>
                    {game} ×
                  </button>
                ))}
              </div>
            )}

            <label>Platform</label>
            <select value={platform} onChange={event => setPlatform(event.target.value)}>
              <option>All</option>
              <option>PC</option>
              <option>PlayStation</option>
              <option>Xbox</option>
            </select>

            <p className="muted">{filteredPlayers.length} player(s) found</p>
          </aside>

          <section>
            <div className="stack">
              {filteredPlayers.length === 0 ? (
                <div className="panel empty-player-results">
                  <h3>No players found</h3>
                  <p>Try removing a game, changing the platform, or clearing the search.</p>
                </div>
              ) : (
                filteredPlayers.map(player => (
                  <article className="player-card" key={player.id}>
                    <div className="avatar">{player.name.slice(0, 2).toUpperCase()}</div>

                    <div className="grow">
                      <h3>{player.name}</h3>
                      <p>{player.games.join(' · ')} · {player.platform} · {player.rank}</p>

                      <div className="tags">
                        {player.games.map(game => <span key={game}>{game}</span>)}
                        <span>{player.style}</span>
                        <span>{player.availability}</span>
                      </div>
                    </div>

                    <button className="btn green" onClick={() => alert(`Team request sent to ${player.name}`)}>
                      Send Request
                    </button>
                  </article>
                ))
              )}
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

              <button className="btn primary full" type="submit">Publish Post</button>
            </form>

            <div className="stack">
              {posts.map(post => (
                <article className="post-card" key={post.id}>
                  <div className="grow">
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <small>{post.members} members</small>
                    {post.isOwner && <span className="owner-label">Your post</span>}
                  </div>

                  <div className="post-actions">
                    {!post.isOwner && (
                      <button className="btn green" onClick={() => alert('Join request sent!')}>Join</button>
                    )}

                    {post.isOwner && (
                      <button className="btn danger" onClick={() => deletePost(post.id)}>Delete</button>
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
