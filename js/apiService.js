/*
This API is used to get flashcards and categories JSON from the server to the client. 

the client is exposed to two functions, 

fetchCategories
fetchFlashcards

apiService is responsible for looking at which backend is in use, importing all backend
APIs from apiServiceBAckends, and choosing the correct backend API to export. 

*/
import { BACKEND } from './config.js';

import {
    fetchCategoriesNode,
    fetchFlashcardsNode,
    fetchCategoriesPHP,
    fetchFlashcardsPHP
} from './apiServiceBackends.js';

// Scalable backend registry
const backends = {
    NODE: {
        fetchCategories: fetchCategoriesNode,
        fetchFlashcards: fetchFlashcardsNode
    },
    PHP: {
        fetchCategories: fetchCategoriesPHP,
        fetchFlashcards: fetchFlashcardsPHP
    }
};

// Export unified API functions
export const fetchCategories = backends[BACKEND].fetchCategories;
export const fetchFlashcards = backends[BACKEND].fetchFlashcards;
