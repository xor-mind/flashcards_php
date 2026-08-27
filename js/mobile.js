// this is application specific UI javascript.
// the goal is to add UI functionality to the hamburger menu.
// the collapsing tree/list behavior (indicator toggle, dblclick expand,
// "selected" highlight) lives in flashcards.js now -- it's shared by both
// mobile.html and desktop.html, so it shouldn't be duplicated here too.
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
}

setupMobileUI();
