let currentRotation = 0;

function displayFlashCard(flashcard) 
{
    const frontElement = document.getElementById('front');
    const backElement = document.getElementById('back');

    // Update the content based on the flashcard data
    frontElement.innerHTML = `<p>${flashcard.front}</p>`;
    backElement.innerHTML = `<p>${flashcard.back}</p>`;
}

// utilize CSS's backface-visibility:hidden and transform/rotateY to flip a "coin" like div
// which solves the problems of displaying a flashcard :D
function flipCard() 
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    // Increase the rotation by 180 degrees
    currentRotation += 180;

    // Optional: Use modulus to keep the rotation within 360 degrees
    // This step is not strictly necessary for the rotation effect but keeps numbers manageable

    // Apply the rotation
    front.style.transform = `rotateY(${currentRotation}deg)`;
    back.style.transform = `rotateY(${currentRotation+180}deg)`;
    // if (currentRotation === 360)
    // {
    //     currentRotation = 0;
    // }    
}

export { displayFlashCard, flipCard };
