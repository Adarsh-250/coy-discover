@"
# Coy — Discover Tab

A mobile-first, swipe-based discovery web application built as a standalone feature extension for **Coy**, designed around Coy's core privacy rule: **never reveal who liked you unless it is mutual.**

---

## Tech Stack

- **Frontend:** React 19, Vite, Framer Motion, Lucide Icons (Coy-inspired neo-brutalist mobile-first UI)
- **Backend:** Node.js, Express (ES Modules, layered `routes -> services -> db` architecture)
- **Database:** SQLite (`better-sqlite3`) with transactional swipe/match logic and persistent storage
- **Testing:** Vitest + Supertest (isolated in-memory `:memory:` SQLite suite + disk persistence verification)

---

## Project Structure

```text
coy-discover/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # TabBar, SwipeDeck, ProfileCard, MatchModal, MatchesList
│       ├── pages/           # HomeTab (blank placeholder), DiscoverTab
│       └── api.js           # Backend API client
├── server/                  # Express + SQLite backend
│   ├── src/
│   │   ├── routes/          # HTTP layer (feed.js, swipe.js, matches.js)
│   │   ├── services/        # Business logic & transactions (swipeService.js)
│   │   ├── db.js            # SQLite schema & connection
│   │   ├── seed.js          # Seeds 40 profiles + 10 incoming likes for demoing
│   │   ├── app.js           # Express app factory
│   │   └── index.js         # Server entrypoint
│   └── tests/               # Automated API & privacy tests
└── README.md