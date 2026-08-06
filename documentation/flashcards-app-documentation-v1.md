# Flashcards App Software Documentation

**Version 1.0**

Flashcards is an online education application. The Flashcards App solves the problem of flashcard training online for me.

## General Requirements

- Hosting on my personal website for my lifetime of learning
- Implement a responsive flashcard app so the UI solution can handle small and large resolution devices (targeting phone or desktop)
- The code is transparent and I can modify it at will to handle future technologies and environments, such as VR UIs or new standards of hosting and full stack development

## Software Requirements

### Functionality

- Basic flashcard mechanics
    - Viewing and selecting categories
        - Display a list of all flashcard fronts that reference the category
    - Viewing and selecting a single flashcard
        - Display just the front of a card
        - Let the user flip the card and see the back of the card

### UI

- Dark mode
- Mobile UI
    - Hamburger menu displaying categories, with the page showing the flashcard titles
- Desktop UI
    - Two column page with a splitter: left column displaying categories, right column displaying flashcards
    - Desktop UI is trying to be a lot like jMemorize, a Java-based flashcard app
- Both UIs able to display the flashcard as a flippable card that can be clicked/touched
- Easily switch between the two UIs as the window is resized

### Database

- Table for categories
- Table for flashcards

### Notes

In a future version, CRUD operations, a user UI, and a login system will be created.
A design requirement for Flashcards v1.0 is to keep the app simple and launch sooner.

## Plan to Solve

A vanilla website can easily solve all requirements while keeping cognitive load and stress reduced. This is within my skillset.

## Language and Tool Solution for Requirements

The front end is vanilla HTML/JavaScript/CSS.
The backend can be Node or PHP.
The database will be MySQL/MariaDB.\*

\* This document will cover only the PHP part of the backend when appropriate. Node will be covered in a future update to this document.

## System Architecture

```
Client (Browser)
    - Loads mobile.html or desktop.html, and relevant JavaScript
    - Fetches flashcards from server via API
    - Renders UI dynamically
    - Handles interactions (flip, category selection)

Server (PHP)
    - Provides REST endpoints
    - Returns JSON flashcard data

Database (MySQL/MariaDB)
    - Stores categories
    - Stores flashcards
```

### System Architecture - Client

The client consists of HTML, CSS, and JavaScript.

`index.html`, `desktop.html`, and `mobile.html` contain `responsive-router.js`. This makes it so the site changes UIs based on resolution. `index.html` will immediately go to `desktop.html` or `mobile.html`, and `mobile.html` and `desktop.html` can switch between themselves based on a resolution breakpoint, i.e. width < 600px.

CSS is loaded to style the app (see **Directory Hierarchy and Files**, below, for what each stylesheet covers).

The client then loads `flashcard.js`, which sets up the app. `flashcard.js` imports `dataService.js` to fetch and render the categories and flashcards. `dataService.js` uses `apiService.js` to get the category and flashcard data, and then `dataService.js` renders the category and flashcard data to the app's relevant elements.

### System Architecture - Server (PHP)

The server exposes two REST endpoints consumed by `apiService.js`: `get_categories.php` and `get_flashcards.php`.

**`get_categories.php` — Category API Response Structure**

Endpoint: `GET /php/get_categories.php`

Returns a hierarchical category tree. This allows the frontend to render nested categories (e.g., Beginner → Example) without performing additional queries.

The server uses a single SQL query and a single-pass tree builder to transform flat database rows into a nested JSON structure.

**Data Model**

Each category record in the database has:
- `id` — unique identifier
- `name` — category label
- `parent_id` — NULL for top-level categories; otherwise the ID of the parent category

This is a classic adjacency list model.

**Returned JSON Structure**

The API returns an array of top-level categories, each containing a `children` array.

Abstract structure:
```json
[
  {
    "id": "<string>",
    "name": "<string>",
    "parent_id": null,
    "children": [
      {
        "id": "<string>",
        "name": "<string>",
        "parent_id": "<string>"
      }
    ]
  }
]
```

Example representation:
```
Beginner
├── Documentation
└── Example

Intermediate
├── Database
└── GUI
```

**`get_flashcards.php` — Flashcards API Response Structure**

Endpoint: `GET /php/get_flashcards.php?category_id={id}`

Returns flashcards, optionally filtered by category.

**Query Parameters**
- `category_id` (optional) — returns flashcards belonging to the specified category and all of its descendants

**Response Format**

An array of flashcard objects, each with:
- `id`
- `front`
- `back`
- `category_id`

**Notes**
- Filtering is hierarchy-aware, using BFS traversal to collect all descendant categories.
- The API always returns a flat list of flashcards.
- Supports multi-level category trees without additional queries.

## HTML Visual Structure

Both `mobile.html` and `desktop.html` share several key DOM elements used by the JavaScript runtime.

**1. Category List Container**

```html
<ul id="all-categories-list"></ul>
```

This element is where the application dynamically renders the list of flashcard categories. `dataService.js` retrieves this element via:

```js
const allCategoriesList = document.getElementById('all-categories-list');
```

and populates it when categories are loaded.

> **Open question:** `get_categories.php` returns a nested category tree, but this container is a single flat `<ul>`. This doc doesn't yet say whether the renderer should flatten the tree with indentation, build nested `<ul>`s per level, or keep the sidebar flat and rely on the hierarchy-aware filtering in `get_flashcards.php` alone. Worth deciding before writing `dataService.js`'s category-rendering logic.

**2. Flashcard List Container**

```html
<div id="flashcards_list"></div>
```

This element is used by `dataService.js` to render the list of flashcards belonging to the selected category.

**3. Flashcard Overlay Structure**

Both HTML files include the overlay used to display a single flashcard:

```html
<div id="overlay">
    <div class="flashcard" id="flashcard">
        <div class="front" id="front"></div>
        <div class="back" id="back"></div>
    </div>
</div>
```

When a user selects a flashcard, this overlay is populated with the flashcard's data. This occurs through the click-handler closure created during rendering:

```js
p.onclick = () => showFlashcardOverlay(flashcard);
```

Each rendered `<p>` element representing a flashcard stores a closure containing its flashcard data, enabling the overlay to display the correct content when clicked.

## Program Flow

### Front End

The website starts with `index.html`, which redirects to `mobile.html` or `desktop.html`. Both mobile/desktop.html use the same app logic (same JS) and some of the same elements.

The HTML will load up `flashcard.js`, which gets the data from the server and renders it to the page's elements.

```
index.html -> { mobile.html, desktop.html } -> flashcard.js -> dataService.js -> apiService.js -> apiServiceBackends.js -> Server
```

`flashcard.js` initiates the app by calling `dataService.js`'s `fetchAndRenderCategories()` and `fetchAndRenderFlashcards()`.

`dataService.js` first calls `apiService.js`'s `fetchCategories()` and `fetchFlashcards()`, which get the JSON data from the server. `dataService.js` will then render that data to the DOM:

- The flashcards are rendered to `<p>`s inside a `<div id="flashcards_list">`.
- The categories are rendered to `<li>`s inside a `<ul id="all-categories-list">`.

`apiService.js` figures out which backend is being used through `config.js`, and then calls the right signature from `apiServiceBackends.js`, which is a file that does the actual connection to the server.

`flashcard.js` does some further UI setup, which will be decoupled in future versions.

### Back End

`get_categories.php` and `get_flashcards.php` just wait to be called and return the relevant data. They both reference `db.php`, which provides credentials and identifiers for the database.

## Directory Hierarchy and Files

Root:
```
css
js
php

index.html    - home page that redirects to desktop.html or mobile.html
desktop.html  - desktop homepage, contains crucial DOM elements and links to app css/js
mobile.html   - mobile homepage, contains crucial DOM elements and links to app css/js
```

**css:**
```
flashcards.css     - flashcard overlay UI and effects
nightmode.css      - general website colors to provide a dark mode
splitter.css       - splitter UI and effects
style_desktop.css  - desktop site general colors and style
style_mobile.css   - mobile site general colors and style
```

**js:**
```
apiService.js          - connects to the correct backend and returns it
apiServiceBackends.js  - provides all backend connections for all servers
config.js              - configures which backend to use
dataService.js         - gets flashcard and category data and renders it to the DOM
flashcard.js           - sets up the app and adds some UI behavior
mobile.js              - adds UI functionality to the hamburger menu
responsive-router.js   - switches to the correct UI based on resolution
splitter.js            - adds UI splitter functionality
uiService.js           - currently provides UI functionality for overlay
```

**php:**
```
db.php              - credentials and identifiers for the database
get_categories.php  - REST endpoint: gets category data from server
get_flashcards.php  - REST endpoint: gets flashcard data from server
```
