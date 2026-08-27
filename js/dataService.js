/*
Data layer: fetches flashcard and category data from the backend and hands it
back as plain data(parsed JS objects/arrays), not DOM elements. This file never touches the DOM -- that's renderService.js's
job now. There's no extra shaping to do yet (apiService.js already returns data
in the shape the rest of the app wants), so this file is intentionally thin. It
stays separate so the rest of the app imports "the data source," not
"apiService.js specifically" -- if real shaping/caching is ever needed, this is
where it goes without anyone else having to change their imports.
*/
import { fetchCategories, fetchFlashcards } from './apiService.js';

export { fetchCategories, fetchFlashcards };
