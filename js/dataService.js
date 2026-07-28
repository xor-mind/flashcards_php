import { fetchCategories, fetchFlashcards } from './apiService.js';

const fetchAndRenderCategories = () => {
    const allCategoriesList = document.getElementById('all-categories-list');
    allCategoriesList.innerHTML = ''; // Clear existing list

    fetchCategories()
        .then(data => {
            appendCategories(data, allCategoriesList);
        })
        .catch(error => console.error('Error:', error));
};

const appendCategories = (categories, parentElement) => 
{
    categories.forEach(category => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';


        // Add the '+' indicator if there are child categories
        const indicator = category.children && category.children.length > 0 ? '<span class="indicator"></span> ' : '';
        // Use innerHTML to allow HTML content to be interpreted, not just text
        link.innerHTML = indicator + category.name;


        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Check if the click was on the indicator
            if (e.target.classList.contains('indicator')) {
                // Do nothing or handle differently if needed
                return;
            }            
            // Assume fetchAndRenderFlashcards is defined elsewhere
            fetchAndRenderFlashcards(category.id);
        });
        listItem.appendChild(link);
        parentElement.appendChild(listItem);

        if (category.children && category.children.length > 0) {
            const subList = document.createElement('ul');
            subList.classList.add('submenu');
            appendCategories(category.children, subList);
            listItem.appendChild(subList);
        }
    });
};

document.getElementById('all-categories').addEventListener('click', function(e) {
    e.preventDefault();
    // Potentially refresh the view or apply a filter that shows all categories
    fetchAndRenderFlashcards(); // No category ID passed for "All" categories    
    //console.log('All categories selected');
    //fetchCategories(); // This might be a way to "reset" to showing all categories, depending on implementation
});

const fetchAndRenderFlashcards = (categoryId = null) => {
    const flashcardsListDiv = document.getElementById('flashcards_list');
    flashcardsListDiv.innerHTML = ''; // Clear existing flashcards

    fetchFlashcards(categoryId)
        .then(data => {
            data.forEach(flashcard => {
                const p = document.createElement('p');
                p.textContent = flashcard.front; // Assuming your flashcard objects have a `front` property
                p.style.cursor = 'pointer'; // Suggest to users that these are clickable
                p.onclick = () => showFlashcardOverlay(flashcard); // Setup click handler
                flashcardsListDiv.appendChild(p);
            });
        })
        .catch(error => console.error('Error displaying flashcards:', error));
};

function showFlashcardOverlay(flashcard) {
    // Assuming you have a div with id 'overlay' in your HTML to serve as the overlay background
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex'; // Show the overlay. Use flex to center the flashcard div

    // Assuming you have divs with ids 'front' and 'back' inside the overlay for the flashcard content
    const frontDiv = document.getElementById('front');
    const backDiv = document.getElementById('back');

    // Update the content of the front and back divs
    frontDiv.innerHTML = `<p>${flashcard.front}</p>`;
    backDiv.innerHTML = `<p>${flashcard.back}</p>`;
}

// Optional: Function to hide the overlay when it's clicked or when a close button is pressed
function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none'; // Hide the overlay
}

// Don't forget to add an event listener or a close button inside your overlay to call hideOverlay() when needed

function fetchFlashCard() {
    return fetch('http://localhost/get_flashcards.php')
        .then(response => response.json())
        .then(data => {
            // Return the flashcard data for external handling
            if (data.length > 0) {
                return data[0]; // Return the first flashcard data
            }
            throw new Error('No flashcards found');
        });
}


export { fetchCategories, fetchFlashCard, fetchAndRenderFlashcards, hideOverlay, fetchAndRenderCategories };
