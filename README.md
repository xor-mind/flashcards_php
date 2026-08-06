# Flashcards App

A personal, self-hosted flashcard trainer. Vanilla HTML/CSS/JS on the front end, PHP + MySQL/MariaDB on the back end, built to run on my own site for the long haul — and to stay simple enough that I can rip out and replace any layer later (new hosting, a Node backend, a VR UI, whatever comes next).

Desktop UI takes cues from [jMemorize](https://github.com/mrikke/jmemorize); mobile UI is a hamburger menu over the same flashcard/category logic.

## Status

**v1.0 — read-only viewer.** Browse categories, browse flashcards, flip a card. No accounts, no editing, no CRUD yet — that's the plan for v2. See [`documentation/flashcards-app-documentation-v1.md`](documentation/flashcards-app-documentation-v1.md) for the full spec, API contracts, and DOM structure.

## Features

- Browse a hierarchical category tree
- View flashcards belonging to a category
- Click/tap a card to flip it
- Dark mode
- Responsive: two-column desktop layout with a splitter ⇄ mobile hamburger menu, switching automatically around a 600px breakpoint

## Tech Stack

- **Frontend:** vanilla HTML, CSS, JavaScript (ES modules)
- **Backend:** PHP (default), with a Node backend stubbed out for later — switch via `js/config.js`
- **Database:** MySQL / MariaDB

## Getting Started (local, XAMPP)

1. Clone this repo into your XAMPP `htdocs` folder (or equivalent web root).
2. Create a database named `flashcards` and import the schema + sample data from [`documentation/flashcards.sql`](documentation/flashcards.sql) (phpMyAdmin or `mysql` CLI both work).
3. Check `php/db.php` — the defaults (`root`, no password) match a stock XAMPP install. Update them if your local MySQL differs.
4. Start Apache and MySQL in XAMPP.
5. Visit the site in your browser. `index.php` → `index.html` → `desktop.html` or `mobile.html`, depending on your screen width.

## Project Structure

```
flashcards_php/
├── index.html            # routes to desktop.html or mobile.html by screen width
├── index.php             # entry point, redirects to index.html
├── desktop.html
├── mobile.html
├── css/                   # dark mode, splitter, and per-UI styling
├── js/                    # app logic, data/API services, UI behavior
├── php/                   # REST endpoints (get_categories.php, get_flashcards.php) + db.php
└── documentation/         # architecture, DB schema, API contracts
```

For anything beyond "how do I run this" — API response shapes, the client → server call chain, DOM element contracts, open design questions — see [`documentation/flashcards-app-documentation-v1.md`](documentation/flashcards-app-documentation-v1.md).

## Roadmap

- CRUD for categories and flashcards
- User accounts and login
- Node backend parity with the PHP backend
