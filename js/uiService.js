/*
Overlay layer: the only file that touches #overlay / #flashcard / #front / #back.
Owns the flip rotation state and resets it whenever a card opens or closes, so
rotation from one card never leaks onto the next -- this is the fix for the
flip-axis bug.
*/

let currentRotation = 0;

function resetFlip() {
    const front = document.getElementById('front');
    const back = document.getElementById('back');
    currentRotation = 0;
    // Clear the inline transform so the base CSS (front at 0deg, back at
    // 180deg) takes over again, rather than re-stating those values here too.
    front.style.transform = '';
    back.style.transform = '';
}

function openCard(flashcard) {
    const overlay = document.getElementById('overlay');
    const front = document.getElementById('front');
    const back = document.getElementById('back');

    resetFlip(); // every card opens face-up, no matter how the last one was left
    front.innerHTML = `<p>${flashcard.front}</p>`;
    back.innerHTML = `<p>${flashcard.back}</p>`;
    overlay.style.display = 'flex';
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
    resetFlip(); // don't let this card's rotation leak into the next one
}

// utilize CSS's backface-visibility:hidden and transform/rotateY to flip a "coin" like div
// which solves the problems of displaying a flashcard :D
function flipCard() {
    const front = document.getElementById('front');
    const back = document.getElementById('back');

    currentRotation += 180;
    front.style.transform = `rotateY(${currentRotation}deg)`;
    back.style.transform = `rotateY(${currentRotation + 180}deg)`;
}

export { openCard, closeOverlay, flipCard };
