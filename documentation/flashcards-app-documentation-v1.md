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
    - Desktop UI is trying to be a lot like [jMemorize](https://sourceforge.net/projects/jmemorize/), a Java-based flashcard app
- Both UIs able to display the flashcard as a flippable card that can be clicked/touched
- Easily switch between the two UIs as the window is resized

### Database

- Table for categories
- Table for flashcards

### Design
- Software documentation: what is it, how does it work.
- currenlty no need for code documentation as this version is very barebones and contains no complex abstractions or systems.

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

## High-Level View of the Flashcard App

The application consists of two single-page applications — a desktop variant and a mobile variant — that hand off automatically at a 600px breakpoint*. Each variant is a self-contained HTML/JS/PHP SPA; no further page reloads occur within a session once a variant has loaded. Both variants share the same app logic(flashcard data -> dom) with only UI related differences.

* i chose this value arbitrarily, and I may change after I test the app

### Design Choice

I chose a two-SPA solution because I first tried a responsive CSS architecture using media queries, structuring the DOM so a single UI could represent a flashcard app regardless of resolution.

My desktop and mobile UIs turned out to be too different for that to work well, though. The desktop UI looks like two panes with a splitter. The mobile UI looks like a single page with a slide-over panel linked to a hamburger menu.

Responsive CSS, within my ability, required strong coupling between the mobile and desktop DOM to represent both sets of UI functionality. Desktop UI code had to include hamburger-menu DOM it never used, and mobile UI code had to include splitter DOM it never used. That made testing difficult — the code structure was messy and entangled.

I also don't know how to properly hide/unhide DOM elements at a breakpoint without breaking separation of concerns. Desktop CSS ended up aware of some mobile UI elements, and mobile CSS aware of some desktop UI elements.

I decided the two UIs were different enough that I wanted to treat the mobile and desktop code separately, which would make testing and development easier.

From there, I tried building my own JavaScript bootloader to inject the mobile and desktop code into the homepage (`index.html`), so I could have a real SPA. It seemed like a fun and cool idea — fetch `mobile.html`/`desktop.html` and hot-swap their JS/CSS into the live document at runtime, all to avoid the redirect. I abandoned this due to script re-execution and cleanup issues.

The redirect is the intentional, simpler design that I landed on. I get to code two separate webpages — one mobile, one desktop — with no confusion between them. Both variants share the same core logic module (`flashcards.js`), so nothing here is copy-pasta — it's just the UI DOM and some mobile- or desktop-specific JavaScript that differ, and that's perfect.



### System Architecture - Client

The App will first redirect a user to either mobile.html or desktop.html.

`desktop.html` and `mobile.html` contain `responsive-router.js`, which makes the site change UIs based on resolution. 

CSS is loaded to style the app (see **Directory Hierarchy and Files**, below, for what each stylesheet covers).

The app then loads `flashcards.js`, which is the main and only file that wires the rest of the app together. The app is split into single-responsibility layers:

- **Data layer** — `dataService.js` fetches category and flashcard data (via `apiService.js`) and returns it as plain data — parsed JS objects/arrays, never DOM elements. Right now it's a thin pass-through. The view layer could fetch straight from `apiService.js` instead, but this layer exists so the rest of the app imports "the data source," not `apiService.js` specifically — if shaping or caching is ever needed, it goes here without any caller changing its imports. 
- **View layer** — `renderService.js` turns already-fetched data into DOM elements. It doesn't fetch data or decide what a click does; callers pass a callback that it invokes with the clicked category id / flashcard.
- **Overlay layer** — `uiService.js` is the only file that touches the single-flashcard overlay (`#overlay`, `#flashcard`, `#front`, `#back`) and owns the flip-rotation state.

`flashcards.js` fetches data through `dataService.js`, hands it to `renderService.js` to build the DOM, and passes `uiService.js`'s `openCard` as the click callback so a rendered flashcard opens in the overlay.

### System Architecture - Server (PHP)

documentation/flashcards.sql contain's Database Schema & Sample Data.

PHP scripts returning flashcard and category JSON are consumed by `apiService.js`: `get_categories.php` and `get_flashcards.php`.

#

**`get_categories.php` — Category API Response Structure**


Returns a hierarchical category tree. This allows the frontend to render nested categories (e.g., Beginner → Example) without performing additional queries.

The server uses a single SQL query and a single-pass tree builder to transform flat database rows into a nested JSON structure.


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

#

**`get_flashcards.php` — Flashcards API Response Structure**


Returns flashcards, optionally filtered by category.

Where `get_categories.php` returns a tree, this endpoint returns a flat list. The hierarchy lives entirely on the category side; a flashcard only carries a `category_id` pointing at wherever it sits in that tree. The response shape therefore never changes — filtering changes which rows come back, not how they are nested.

`GET /php/get_flashcards.php?category_id={id}`

`category_id` is optional and must be numeric — the endpoint tests `isset()` and `is_numeric()` together. If either test fails, filtering is skipped entirely and every flashcard in the table is returned. There is no error response for a bad `category_id`; the request quietly degrades to "give me everything."


**Filtering Is Subtree-Wide**

Passing a `category_id` does not return only that category's cards. It returns that category's cards *and* the cards of every category nested beneath it, at any depth.

`getAllDescendantIds()` performs a breadth-first walk of the category tree. It seeds a queue with the requested id, then repeatedly pops an id, records it, and queries `categories` for rows whose `parent_id` matches that id, pushing those children onto the queue. The walk ends when the queue empties, and it returns every id it visited — the requested category included.

Requesting `Beginner` therefore covers its whole subtree:

```
Beginner            <- requested
├── Documentation   <- included
└── Example         <- included

Intermediate        <- not included
├── Database
└── GUI
```

The collected ids then become a single prepared statement, one placeholder per id, all bound as integers:

```sql
SELECT * FROM flashcards WHERE category_id IN (?, ?, ?)
```

One request, one subtree, one flashcard query. This is the same intent as `get_categories.php`: hand the frontend everything it needs in a single round trip rather than making it walk the tree itself with follow-up calls.

Worth noting the cost, since it is invisible from the client side: the walk itself issues one query per category it visits. At the current tree size that is irrelevant, but it is a recursive-query-shaped problem being solved with a loop, and it is the first thing I would revisit if the category tree ever gets deep.


**Returned JSON Structure**

The API returns a flat array of flashcard objects — no `children`, no nesting. Values arrive as strings, because `mysqli`'s `fetch_assoc()` returns every column as a string regardless of its SQL type, so `id` is `"3"` rather than `3`.

Abstract structure:
```json
[
  {
    "id": "<string>",
    "front": "<string>",
    "back": "<string>",
    "category_id": "<string>"
  }
]
```

Example representation, using the sample data in `documentation/flashcards.sql`. Category `1` is `Beginner`, with `Example` (`3`) and `Documentation` (`4`) nested beneath it. `Beginner` holds no cards of its own, so every card below comes from its children — which is exactly the behavior the subtree walk exists to provide:

`GET /php/get_flashcards.php?category_id=1`

```json
[
  {
    "id": "3",
    "front": "Give an example of a loop structure in programming.",
    "back": "For loop, while loop, do-while loop.",
    "category_id": "3"
  },
  {
    "id": "4",
    "front": "What is recursion in computer science?",
    "back": "A method of solving a problem where the solution depends on solutions to smaller instances of the same problem.",
    "category_id": "3"
  },
  {
    "id": "5",
    "front": "Why is documentation important in programming?",
    "back": "It helps others understand the codebase, making maintenance and updates easier.",
    "category_id": "4"
  },
  {
    "id": "6",
    "front": "What should good documentation include?",
    "back": "Purpose of the code, how to install and use it, and examples of key functions.",
    "category_id": "4"
  }
]
```

A request with no `category_id` skips the walk entirely and runs `SELECT * FROM flashcards`, returning every card in the table in the same flat shape.

When a category and its whole subtree contain no cards, the response is an empty array, `[]`, not an error. The frontend renders an empty list and nothing needs to special-case it.


## HTML Visual Structure

Both `mobile.html` and `desktop.html` share several key DOM elements used by the JavaScript runtime.

**1. Category List Container**

```html
<ul id="all-categories-list"></ul>
```

This element is where the application dynamically renders the list of flashcard categories. `flashcards.js` retrieves this element via:

```js
const categoriesListEl = document.getElementById('all-categories-list');
```

and passes it to `renderService.js`'s `renderCategories()` when categories are loaded.

`renderService.js` renders the nested tree returned by `get_categories.php` as nested `<ul>`s: each category with children gets a `<ul class="submenu">` appended to its `<li>`, and categories with children are marked with a `<span class="indicator">` (the expand/collapse `+`). The collapse/expand behavior and the "selected" highlight are handled by the `navbar` click/dblclick listeners in `flashcards.js`.

**2. Flashcard List Container**

```html
<div id="flashcards_list"></div>
```

This element is used by `renderService.js` to render the list of flashcards belonging to the selected category.

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

When a user selects a flashcard, this overlay is populated with the flashcard's data. `renderService.js` gives each rendered `<p>` a click-handler closure that calls back into whatever the controller passed in:

```js
p.onclick = () => onCardClick(flashcard);
```

`flashcards.js` passes `uiService.js`'s `openCard` as `onCardClick`, so clicking a flashcard calls `openCard(flashcard)`, which resets the flip state, fills `#front`/`#back`, and shows the overlay. Each `<p>` stores a closure containing its own flashcard data, so the overlay displays the correct content when clicked.

#

Mobile.html and Desktop.html also have key differences. Mobile.html has a hamburger menu and desktop.html has splitter panes. 
This is the payoff for choosing a 2 page SPA design. The UI's are properly decoupled, are easy to test, and fulfil the software's needs. 




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
dataService.js         - data layer: fetches flashcard and category data (no DOM)
renderService.js       - view layer: turns fetched data into DOM elements
flashcards.js          - controller: wires data/view/overlay layers and category-tree UI
mobile.js              - adds UI functionality to the hamburger menu
responsive-router.js   - switches to the correct UI based on resolution
splitter.js            - adds UI splitter functionality
uiService.js           - overlay layer: owns the flashcard overlay and flip state
```

**php:**
```
db.php              - credentials and identifiers for the database
get_categories.php  - REST endpoint: gets category data from server
get_flashcards.php  - REST endpoint: gets flashcard data from server
```
