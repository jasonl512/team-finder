# Team Finder — Server

Simple Express + PostgreSQL backend.

## Setup

1. Make sure PostgreSQL is running and create the database:
   ```
   createdb team_finder
   ```

2. Copy the env file and fill it in:
   ```
   cp .env.example .env
   ```

3. Install and run:
   ```
   npm install
   npm run dev
   ```

Tables are created automatically when the server starts.
Server runs at http://localhost:5000 — test it with http://localhost:5000/api/health

## Routes

| Method | Route | Login needed | What it does |
|---|---|---|---|
| POST | /api/users/register | no | Create account (username, email, password) |
| POST | /api/users/login | no | Log in, returns a token |
| GET | /api/users/me | yes | Get your profile |
| PUT | /api/users/me | yes | Update bio / game / platform / rank |
| GET | /api/players | no | List all players (filters: ?game=&platform=) |
| GET | /api/posts | no | List all team posts |
| POST | /api/posts | yes | Create a post (title, description, game) |
| DELETE | /api/posts/:id | yes | Delete your own post |
| GET | /api/messages | yes | People you've chatted with |
| GET | /api/messages/:userId | yes | Messages between you and one user |
| POST | /api/messages/:userId | yes | Send a message (body) |

For routes that need login, send the token in the header:
```
Authorization: Bearer <token>
```
