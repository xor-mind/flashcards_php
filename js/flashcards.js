/*
contains the javascript that setups a few essentials of Adam's Flashcard app. 
1. contacts the servers and get the flashcard related data.
2. setups the custom flashcard UI funcitonality

the flashcard app also relies on 
flashcards.css contains crucial
index.html
*/
import { fetchAndRenderCategories, fetchAndRenderFlashcards, hideOverlay } from './dataService.js';
import {  flipCard } from './uiService.js';

document.addEventListener('DOMContentLoaded', function() 
{
    fetchAndRenderCategories(); // get all the flash card categories from the server and render them
    fetchAndRenderFlashcards(); // get the all the flash cards from the server and render them. the default parameter(nothing) gives us all flashcards

    // code below is for my custom "collasping" list. we need to setup a bunch of click handlers
    const navbar = document.querySelector('.navbar');
    
    // this is for the flashcard categories UI
    // this is UI effects that triggers on clicks. 
    // the categories UI is expanded and selection UI is updated.
    navbar.addEventListener('click', function(e) 
    {
        e.preventDefault(); // Prevent default action only for indicator click

        // Check if the click is on an indicator or a link
        const target = e.target;
        const isIndicator = target.classList.contains('indicator');

        if (isIndicator) 
        {
            const parentItem = target.closest('li');
            const submenu = parentItem.querySelector('.submenu');
            if (submenu) 
            {
                submenu.classList.toggle('expanded');
                target.classList.toggle('expanded', submenu.classList.contains('expanded'));
            }
        } // Handling click for selection
        else if (target.matches('.navbar a')) 
        { 
            // dev note: i can see how this macrscopic. this handles the UI dynamics and state
            // the click also triggers a built in callback function 
            navbar.querySelectorAll('a').forEach(item => item.classList.remove('selected'));
            target.classList.add('selected');
        }
    });

    navbar.addEventListener('dblclick', function(e) {
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

    // mobile: we use a hamburger menu
    document.addEventListener('click', function(e) {
        const pane = document.querySelector('.pane.left-pane'); // Using querySelector to select the pane
        const hamburger = document.getElementById('hamburger-icon');

        // Check if click is outside the sidebar and not on the hamburger icon
        if (!pane.contains(e.target) && !hamburger.contains(e.target) && pane.classList.contains('open')) {
            toggleMenu(); // Close the sidebar
        }
    });
});



// Global variables and event listeners for UI interactions
//document.getElementById("flashcard").addEventListener("click", flipCard);
document.getElementById("overlay").addEventListener("click", hideOverlay);

document.getElementById('flashcard').addEventListener('click', function(event) {
    flipCard();
    event.stopPropagation(); // Prevent the click from bubbling up to the overlay
});

   function toggleMenu() {
        const pane = document.querySelector('.pane.left-pane'); // Using querySelector to select the pane
        pane.classList.toggle('open');
    }  
    document.getElementById('hamburger-icon').addEventListener('click', toggleMenu);