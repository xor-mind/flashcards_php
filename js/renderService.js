/*
View layer: turns already-fetched data into DOM elements. Nothing here fetches
data or decides what a click should do -- callers pass a callback, and these
functions call it with the clicked category id / flashcard. That keeps this
file reusable no matter what should happen next.
*/

function renderCategories(categories, containerEl, onCategoryClick) {
    containerEl.innerHTML = '';
    appendCategories(categories, containerEl, onCategoryClick);
}

function appendCategories(categories, parentElement, onCategoryClick) {
    categories.forEach(category => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';

        // Add the '+' indicator if there are child categories
        const indicator = category.children && category.children.length > 0
            ? '<span class="indicator"></span> '
            : '';
        link.innerHTML = indicator + category.name;

        link.addEventListener('click', function (e) {
            e.preventDefault();
            // Clicking the expand indicator toggles the submenu (handled by
            // the navbar listener in flashcards.js), not a category selection
            if (e.target.classList.contains('indicator')) {
                return;
            }
            onCategoryClick(category.id);
        });

        listItem.appendChild(link);
        parentElement.appendChild(listItem);

        if (category.children && category.children.length > 0) {
            const subList = document.createElement('ul');
            subList.classList.add('submenu');
            appendCategories(category.children, subList, onCategoryClick);
            listItem.appendChild(subList);
        }
    });
}

function renderFlashcards(flashcards, containerEl, onCardClick) {
    containerEl.innerHTML = '';
    flashcards.forEach(flashcard => {
        const p = document.createElement('p');
        p.textContent = flashcard.front;
        p.style.cursor = 'pointer';
        p.onclick = () => onCardClick(flashcard);
        containerEl.appendChild(p);
    });
}

export { renderCategories, renderFlashcards };
