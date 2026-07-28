console.log("hello from mobile.js");
// this is application specific UI javascript. 
// the goal is to add UI functionality to the hamburger menu
// and the navbar, which will host specific flashcard functionality
function setupMobileUI() 
{
    const hamburger = document.getElementById("hamburger-icon");
    const navbar = document.querySelector('.navbar');

    if (hamburger && navbar) {
        hamburger.addEventListener("click", () => {
        navbar.classList.toggle("open");
        });

        document.addEventListener("click", (e) => {
            const isClickInsideNav = navbar.contains(e.target);
            const isClickOnHamburger = hamburger.contains(e.target);
        
            if (!isClickInsideNav && !isClickOnHamburger && navbar.classList.contains("open")) {
                navbar.classList.remove("open");
            }
        });
    }

    // code below is for my custom "collasping" list. we need to setup a bunch of click handlers
    
    // this is for the flashcard categories UI
    // this is UI effects that triggers on clicks. 
    // the categories UI is expanded and selection UI is updated.
    navbar.addEventListener('click', function(e) {
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





}

setupMobileUI();
