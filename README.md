# Team Finder Starter

Includes a React frontend with Home, Team Finder, Messaging Board, and RAWG Game Discovery pages, plus an Express server starter.

## Use it
Copy the `client` and `server` folders into your local `team-finder` repository.

Frontend:
```bash
cd client
npm install
npm run dev
```

Backend:
```bash
cd server
createdb team_finder
npm install
npm run dev
```

RAWG API: copy `client/.env.example` to `client/.env` and add your API key. Never upload `.env`.

Then from the main `team-finder` folder:
```bash
git add .
git commit -m "Add Team Finder pages and server starter"
git push origin main
```
