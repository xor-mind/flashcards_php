/*
Controller: the only file that wires the data layer, view layer, and overlay
layer together. It doesn't build DOM from data (renderService.js does that)
and it doesn't touch the overlay's internals directly (uiService.js does) --
it just decides what happens in response to what.
*/
import { fetchCategories, fetchFlashcards } from './dataService.js';
import { renderCategories, renderFlashcards } from './renderService.js';
import { openCard, closeOverlay, flipCard } from './uiService.js';

document.addEventListener('DOMContentLoaded', function () {
    const categoriesListEl = document.getElementById('all-categories-list');
    const flashcardsListEl = document.getElementById('flashcards_list');

    const showFlashcards = (categoryId) => {
        fetchFlashcards(categoryId)
            .then(cards => renderFlashcards(cards, flashcardsListEl, openCard))
            .catch(error => console.error('Error displaying flashcards:', error));
    };

    fetchCategories()
        .then(tree => renderCategories(tree, categoriesListEl, showFlashcards))
        .catch(error => console.error('Error:', error));

    showFlashcards(); // no category id yet -> "All"

    document.getElementById('all-categories').addEventListener('click', function (e) {
        e.preventDefault();
        showFlashcards(); // no category id -> back to "All"
    });

    // --- collapsible category tree + "selected" highlight ---
    const navbar = document.querySelector('.navbar');

    navbar.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default action only for indicator click

        const target = e.target;
        const isIndicator = target.classList.contains('indicator');

        if (isIndicator) {
            const parentItem = target.closest('li');
            const submenu = parentItem.querySelector('.submenu');
            if (submenu) {
                submenu.classList.toggle('expanded');
                target.classList.toggle('expanded', submenu.classList.contains('expanded'));
            }
        } else if (target.matches('.navbar a')) {
            navbar.querySelectorAll('a').forEach(item => item.classList.remove('selected'));
            target.classList.add('selected');
        }
    });

    navbar.addEventListener('dblclick', function (e) {
        const clickedElement = e.target.closest('a');
        if (clickedElement) {
            const parentItem = clickedElement.closest('li');
            const submenu = parentItem.querySelector('.submenu');
            if (submenu) {
                submenu.classList.toggle('expanded');
                const indicator = clickedElement.querySelector('.indicator');
                if (indicator) {
                    indicator.classList.toggle('expanded', submenu.classList.contains('expanded'));
                }
            }
        }
    });

    // --- flashcard overlay wiring ---
    document.getElementById('overlay').addEventListener('click', closeOverlay);
    document.getElementById('flashcard').addEventListener('click', function (event) {
        flipCard();
        event.stopPropagation(); // don't also trigger the overlay's close handler
    });
});
