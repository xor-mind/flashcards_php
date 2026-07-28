/*
    this is the flashcards API for different types of servers, such as node or php
    apiService.js uses these methods.
*/

// ----------------------
// NODE BACKEND
// ----------------------
export const fetchCategoriesNode = () => {
    return fetch('http://localhost:3000/api/categories')
        .then(r => r.json())
        .catch(e => console.error('Node categories error:', e));
};

export const fetchFlashcardsNode = (categoryId = null) => {
    let url = 'http://localhost:3000/api/flashcards';
    if (categoryId !== null) url += `?category_id=${categoryId}`;

    return fetch(url)
        .then(r => r.json())
        .catch(e => console.error('Node flashcards error:', e));
};


// ----------------------
// PHP BACKEND
// ----------------------
export const fetchCategoriesPHP = () => {
    return fetch('php/get_categories.php')
        .then(r => r.json())
        .catch(e => console.error('PHP categories error:', e));
};

export const fetchFlashcardsPHP = (categoryId = null) => {
    let url = 'php/get_flashcards.php';
    if (categoryId !== null) url += `?category_id=${categoryId}`;

    return fetch(url)
        .then(r => r.json())
        .catch(e => console.error('PHP flashcards error:', e));
};
