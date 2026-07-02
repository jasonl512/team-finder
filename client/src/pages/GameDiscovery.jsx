import { useEffect, useState } from 'react';

const PAGE_SIZE = 12;

export default function GameDiscovery() {
  const [games, setGames] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const [nextPageAvailable, setNextPageAvailable] = useState(false);
  const [status, setStatus] = useState('Loading games...');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  async function fetchGames({ query = '', pageNumber = 1, append = false } = {}) {
    if (!apiKey) {
      setStatus('RAWG API key is missing.');
      return;
    }

    try {
      setLoading(true);
      setStatus(query ? `Searching for "${query}"...` : 'Loading popular games...');

      const params = new URLSearchParams({
        key: apiKey,
        page_size: String(PAGE_SIZE),
        page: String(pageNumber),
        ordering: '-added'
      });

      if (query) {
        params.set('search', query);
        params.set('search_precise', 'true');
      }

      const response = await fetch(`https://api.rawg.io/api/games?${params.toString()}`);
      if (!response.ok) throw new Error(`RAWG request failed: ${response.status}`);

      const data = await response.json();
      const newGames = data.results || [];

      setGames(previous => append ? [...previous, ...newGames] : newGames);
      setNextPageAvailable(Boolean(data.next));
      setStatus(query
        ? `${data.count || newGames.length} result(s) found for "${query}"`
        : 'Popular games from RAWG API');
    } catch (error) {
      console.error(error);
      setStatus('Could not load games. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const cleaned = searchInput.trim();
    setActiveSearch(cleaned);
    setPage(1);
    fetchGames({ query: cleaned, pageNumber: 1, append: false });
  }

  function handleClear() {
    setSearchInput('');
    setActiveSearch('');
    setPage(1);
    fetchGames();
  }

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGames({ query: activeSearch, pageNumber: nextPage, append: true });
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <span className="pill">RAWG API</span>
          <h1>Game Discovery</h1>
          <p>Search for games or browse popular titles, ratings, and release dates.</p>
        </div>

        <form className="game-search-form" onSubmit={handleSearch}>
          <input
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            placeholder="Search for a game, for example Minecraft..."
          />
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
          {(activeSearch || searchInput) && (
            <button className="btn secondary" type="button" onClick={handleClear}>
              Clear
            </button>
          )}
        </form>

        <div className="game-toolbar">
          <small className="status">{status}</small>
          {activeSearch && (
            <span className="search-label">
              Showing results for: <strong>{activeSearch}</strong>
            </span>
          )}
        </div>

        {!loading && games.length === 0 ? (
          <div className="empty-state">
            <h2>No games found</h2>
            <p>Try a different spelling or a broader search term.</p>
          </div>
        ) : (
          <div className="game-grid">
            {games.map(game => (
              <article className="game-card" key={game.id}>
                {game.background_image ? (
                  <img src={game.background_image} alt={game.name} loading="lazy" />
                ) : (
                  <div className="game-placeholder">🎮</div>
                )}

                <div className="game-card-body">
                  <h3>{game.name}</h3>
                  <p>Rating: {game.rating || 'N/A'}</p>
                  <p>Released: {game.released || 'Unknown'}</p>
                  {game.metacritic && <p>Metacritic: {game.metacritic}</p>}

                  {Array.isArray(game.platforms) && game.platforms.length > 0 && (
                    <div className="tags">
                      {game.platforms.slice(0, 3).map(item => (
                        <span key={item.platform.id}>{item.platform.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {nextPageAvailable && games.length > 0 && (
          <div className="load-more-wrapper">
            <button className="btn primary" type="button" onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
