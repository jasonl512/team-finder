import { useState } from 'react';

export default function Profile() {
  const [form, setForm] = useState({
    username: 'JasonPlayer',
    game: 'Valorant',
    platform: 'PC',
    rank: 'Diamond',
    availability: 'Weekday Evenings',
    playstyle: 'Competitive',
    bio: 'Looking for reliable teammates with good communication and no toxicity.'
  });
  const [saved, setSaved] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <span className="pill">PLAYER PROFILE</span>
          <h1>Create your gaming profile</h1>
          <p>Add your game, platform, rank, schedule, and playstyle so other players can decide whether you are a good match.</p>
        </div>

        <div className="profile-layout">
          <section className="panel profile-preview">
            <div className="profile-header">
              <div className="profile-avatar">{form.username.slice(0, 2).toUpperCase() || 'PL'}</div>
              <div>
                <h2>{form.username || 'New Player'}</h2>
                <span className="online">● Available</span>
              </div>
            </div>

            <div className="profile-tags">
              <span>{form.game}</span><span>{form.platform}</span><span>{form.rank}</span><span>{form.playstyle}</span><span>{form.availability}</span>
            </div>

            <div className="profile-section">
              <h3>About Me</h3>
              <p>{form.bio || 'No biography added yet.'}</p>
            </div>

            <div className="profile-stats">
              <div><strong>4.8</strong><span>Rating</span></div>
              <div><strong>26</strong><span>Vouches</span></div>
              <div><strong>12</strong><span>Matches</span></div>
            </div>
          </section>

          <form className="panel profile-form" onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            <label>Username</label>
            <input name="username" value={form.username} onChange={updateField} required />

            <div className="profile-form-row">
              <div>
                <label>Primary Game</label>
                <select name="game" value={form.game} onChange={updateField}>
                  <option>Valorant</option><option>Apex Legends</option><option>Overwatch 2</option><option>Fortnite</option><option>League of Legends</option>
                </select>
              </div>
              <div>
                <label>Platform</label>
                <select name="platform" value={form.platform} onChange={updateField}>
                  <option>PC</option><option>PlayStation</option><option>Xbox</option><option>Nintendo Switch</option>
                </select>
              </div>
            </div>

            <div className="profile-form-row">
              <div>
                <label>Rank</label>
                <select name="rank" value={form.rank} onChange={updateField}>
                  <option>Unranked</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option><option>Diamond</option><option>Master</option>
                </select>
              </div>
              <div>
                <label>Playstyle</label>
                <select name="playstyle" value={form.playstyle} onChange={updateField}>
                  <option>Competitive</option><option>Casual</option><option>Chill</option><option>Tournament</option>
                </select>
              </div>
            </div>

            <label>Availability</label>
            <select name="availability" value={form.availability} onChange={updateField}>
              <option>Weekday Evenings</option><option>Weekends</option><option>Morning</option><option>Flexible</option>
            </select>

            <label>About Me</label>
            <textarea name="bio" rows="5" value={form.bio} onChange={updateField} maxLength="240" />

            <button className="btn primary full" type="submit">Save Profile</button>
            {saved && <p className="profile-success">Profile saved in the frontend demo.</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
