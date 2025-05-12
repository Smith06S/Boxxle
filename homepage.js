function openPopup(infoText) {
    const popup = document.getElementById("popup");
    popup.style.display = "flex"; // Show pop-up
    document.getElementById("popupText").textContent = infoText; // Update the text dynamically
}

// Function to close the pop-up
function closePopup() {
    document.getElementById("popup").style.display = "none"; // Hide pop-up
}

// Function triggered when clicking the "Player" image
function newPlayer() {
    openPopup("Create a new player profile.");
}

// Function triggered when clicking the "Levels" image
function Levels() {
    openPopup("Choose a game level.");
}

// Optional: Add an event listener to close pop-up when clicking outside of it
document.addEventListener("click", (event) => {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        closePopup();
    }
});