// Identify the image paths according to the number on the grid
const IMAGES = {
    0: 'images/background/pattern_62.png',
    1: 'images/background/pattern_19.png',
    2: 'images/target/generic_button_square_fill.png',
    3: 'images/characters/character_femaleAdventurer_idle.png',
    4: 'images/target/generic_button_circle_fill.png',
    5: 'images/target/generic_button_square_outline.png'
};

// Identify the character image paths with the name

const CHARACTERS = {
    "Female Adventurer": 'images/characters/character_femaleAdventurer_idle.png',
    "Male Adventurer": 'images/characters/character_maleAdventurer_idle.png',
    "Female Person": 'images/characters/character_femalePerson_idle.png',
    "Male Person": 'images/characters/character_malePerson_idle.png',
    "Robot": 'images/characters/character_robot_idle.png',
    "Zombie": 'images/characters/character_zombie_idle.png',
};


var perso = "Female Adventurer"; // Default player character
var mvNbr = 0; // Number of moves made by the user

const savedLevelIndex = localStorage.getItem("selectedLevel"); // Takes the index of the current level from localStorage
var currentLevelIndex = savedLevelIndex !== null ? parseInt(savedLevelIndex) : 0; // If the index is not null it will be converted into an int, else it defaults to 0
var currentLevel = Levels[currentLevelIndex]; // Takes the correct game level layout from level.js

var gameboard = document.getElementById('gameboard'); // Reference to the gameboard element by id 
var userPosition = { row: 0, col: 0 }; // Player's position in the grid 
var initialGoalPositions = getGoalPositions(); // Stores the initial positions of the goals

// Finds and sets the player's starting position within the level grid
function getUserPosition() {
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 3) { // Verifies if the cell containes the character represented by '3'
                // Saves the position in 'userPosition'
                userPosition.row = row;
                userPosition.col = col;
                return;
            }
        }
    }
}

// Retrieves all goal positions from the grid
function getGoalPositions() {
    const goalPositions = []; // Initiate an array

    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 4) { // Check if the cell containes a goal represented by '4'
                goalPositions.push({ row, col }); // Saves the position in 'goalPositions'
            }
        }
    }

    return goalPositions;
}

// Updates the level grid based on the player's movements
function updateLevelGrid() {
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 3) {
                var isGoal = false;

                // Loop to ckeck if the player is standing on a goal
                for (var pos of initialGoalPositions) {
                    if (pos.row == row && pos.col == col) {
                        isGoal = true;
                        break;
                    }
                }

                if (isGoal) {
                    currentLevel[row][col] = 4; // If it's tha case then it keeps the goal 
                } else {
                    currentLevel[row][col] = 0; // Otherwise, it reset the position to a background pattern
                }
            }
        }
    }
}

// Checks if the current level is finished by looking for the targets 
function FinishedLevel() {
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 2) { // if there is still a goal then the game is not finished
                return;
            }
        }
    }
    NextLevelOverlay() // Otherwise, the overlay is called
}

// Populates the game grid with elements based on the current level layout
// Each cell is represented by a number that relates to an image url
function fillGrid() {
    if (!gameboard) return;
    gameboard.innerHTML = "";

    // Loop through each cell in the current level grid
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {

            // Create a div element to represent each cell
            const grid = document.createElement('div');
            grid.style.width = '3.5vw';
            grid.style.height = '3.5vw';
            grid.style.position = 'relative';
            grid.style.display = 'flex';
            grid.style.justifyContent = 'center';
            grid.style.alignItems = 'center';

            var cellValue = currentLevel[row][col]; // Get the value of the current cell in the level
            var isPlayerHere = userPosition.row === row && userPosition.col === col; // check if the player is at this cell
            
            // Check if this cell is a goal position
            var isGoalHere = false; 
            for (var i = 0; i < initialGoalPositions.length; i++) {
                if (initialGoalPositions[i].row === row && initialGoalPositions[i].col === col) {
                    isGoalHere = true;
                    break;
                }
            }


            var bgValue; // The image to show

            if (cellValue === 5) {
                bgValue = 5; //The box is on the goal
            } else if (cellValue === 4) {
                bgValue = 4;  // The goal
            } else if (cellValue === 2) {
                bgValue = 2; // The box
            } else if (isPlayerHere && isGoalHere) {
                bgValue = 4; // Player on the goal
            } else if (isPlayerHere) {
                bgValue = 0; // Player on background
            } else if (isGoalHere) {
                bgValue = 4; // Originally a goal
            } else {
                bgValue = cellValue; // Default background
            }

            // Create the background image for the cell
            const cellImg = document.createElement('img');
            cellImg.src = IMAGES[bgValue];
            cellImg.style.width = '100%';
            cellImg.style.height = '100%';
            cellImg.style.objectFit = 'contain';
            grid.appendChild(cellImg);

             // If the player is at this position then add the player on top
            if (isPlayerHere) {
                var characterImage = localStorage.getItem("selectedCharacter") || CHARACTERS["Female Adventurer"];
                const playerImg = document.createElement('img');
                playerImg.src = characterImage;
                playerImg.style.position = 'absolute';
                playerImg.style.width = '100%';
                playerImg.style.height = '100%';
                playerImg.style.objectFit = 'contain';
                playerImg.style.filter = "contrast(150%) brightness(120%)";
                grid.appendChild(playerImg);
            }

            // Add the completed cell to the gameboard
            gameboard.appendChild(grid);
        }
    }
}

// Check if the cell is a goal 
function isGoalCell(row, col) {
    return initialGoalPositions.some(pos => pos.row === row && pos.col === col);
}

// Handles keyboard input to move the player 
window.addEventListener('keydown', function (event) {
    // store thecurrent position of the player
    var newRow = userPosition.row;
    var newCol = userPosition.col;

    // store alsothe position of the next cell
    var nextRow = userPosition.row;
    var nextCol = userPosition.col;

    // handle every direction based on the arrow key pressed
    switch (event.keyCode) {
        case 37: // Left
            if (newCol > 0) newCol -= 1;
            mvNbr += 1;
            nextCol -= 2;
            break;
        case 38: // Up
            if (newRow > 0) newRow -= 1;
            mvNbr += 1;
            nextRow -= 2;
            break;
        case 39: // Right
            if (newCol < currentLevel[0].length - 1) newCol += 1;
            mvNbr += 1;
            nextCol += 2;
            break;
        case 40: // Down
            if (newRow < currentLevel.length - 1) newRow += 1;
            mvNbr += 1;
            nextRow += 2;
            break;
    }

    // change the display of the number of moves 
    document.getElementById('mvNbr').textContent = "Moves: " + mvNbr;

    // if the cell is a background or a goal the player can move
    if (currentLevel[newRow][newCol] == 0 || currentLevel[newRow][newCol] == 4) {
        userPosition.row = newRow;
        userPosition.col = newCol;
    }

    // if the player is trying to move a box
    else if (currentLevel[newRow][newCol] == 2 || currentLevel[newRow][newCol] == 5) {
        // can move the box if the next cell is a background
        if (currentLevel[nextRow][nextCol] == 0) {
            if (isGoalCell(newRow, newCol)) { // if it is a goal cell, then put back the goal image
                currentLevel[newRow][newCol] = 4;
            } else { // else it is becomes a background image
                currentLevel[newRow][newCol] = 0;
            }

            // moves the box to the next cell
            currentLevel[nextRow][nextCol] = 2;

            // moves also the player's position
            userPosition.row = newRow;
            userPosition.col = newCol;
        }
        // if the next cell is a goal
        else if (currentLevel[nextRow][nextCol] == 4) {

            if (isGoalCell(newRow, newCol)) {
                currentLevel[newRow][newCol] = 4;
            } else {
                currentLevel[newRow][newCol] = 0;
            }

            currentLevel[nextRow][nextCol] = 5; // the box on the goal changes immage and becomes 5

            // move the player's position
            userPosition.row = newRow;
            userPosition.col = newCol;
        }
    }
    // refresh the gris
    updateLevelGrid();
    fillGrid();
    // check if the level is completed
    FinishedLevel();
});



// Continuously updates the game grid and requests the next animation frame
function loop() {
    fillGrid();
    requestAnimationFrame(loop); // Calls itself creating an infinite loop
}

// Reloads the page ressetting the game
function resetGame() {
    location.reload();
};

// Opens a pop-up window 
function openPopup(infoText) {
    const popup = document.getElementById("popup");
    if (!popup) return; // Ensures the element exists
    popup.style.display = "flex";
    document.getElementById("popupText").textContent = infoText; // Sets text content
}


// Closes the pop-up window and hides the fireworks 
function closePopup() {
    const popup = document.getElementById("popup");
    const fireworks = document.getElementById("fireworks");

    popup.style.display = "none"; // Hides the pop-up

    // Hides the fireworks if present
    if (fireworks) {
        fireworks.style.display = "none";
    }
}

function newPlayer() {
    // Get the popup and its content container
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    document.getElementById("titleOverlay").textContent = "Choose a player !";

    popupContent.innerHTML = '';

    // Create a container for character selection boxes
    const characterContainer = document.createElement("div");
    characterContainer.className = "character-container";

    // Loop through each character in the CHARACTERS object
    Object.entries(CHARACTERS).forEach(([name, imagePath]) => {
        // Create a box for each character
        const box = document.createElement("div");
        box.className = "character-box";

        const img = document.createElement("img"); // Image
        img.src = imagePath;
        img.alt = name;
        img.style.width = "100%";

        //Add a click event
        box.addEventListener("click", () => {
            perso = name; // Set the chosen character name
            localStorage.setItem("selectedCharacter", CHARACTERS[perso]); // Save to localStorage
            IMAGES[3] = CHARACTERS[perso];  // Update the image array, which are 3
            closePopup();
            fillGrid();
        });

        box.appendChild(img); // Add the image to the character box
        characterContainer.appendChild(box); // Add the character box to the container
    });

    popupContent.appendChild(characterContainer); // Add the character container to the popup content
    popup.style.display = "flex";
};

// Opens the main menu pop-up with various options 
function openMenu() {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");
    const musicState = localStorage.getItem("musicState");
    document.getElementById("titleOverlay").textContent = "Main menu";

    popupContent.innerHTML = "";

    // creates a constant with the buttons
    const buttons = [
        { src: "images/logo/Player.png", alt: "Player", onclick: "newPlayer()", txtContent: "Player" },
        { src: "images/logo/Repeat-Right.png", alt: "reset button", onclick: "resetGame()", txtContent: "Reset game" },
        { src: "images/logo/Home.png", alt: "homepage button", onclick: "window.location.href='index.html';", txtContent: "Home" }
    ];

    // Add the music state based on saved preference to 'buttons'
    if (musicState === "on") {
        buttons.push({ src: "images/logo/Music-On.png", alt: "Music status", id: "musicToggle", onclick: "toggleMusic()", txtContent: "Music status" });
    } else {
        buttons.push({ src: "images/logo/Music-Off.png", alt: "Music status", id: "musicToggle", onclick: "toggleMusic()", txtContent: "Music status" });
    }

    const container = document.createElement("div");
    container.id = "options";

    // Iterates over button options and generates clickable elements
    buttons.forEach(btn => {
        const wrapper = document.createElement("div");
        //wreapper.class = "optionHover";
        wrapper.className = "optionHover";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "20px"; // Spacing between image and text

        const img = document.createElement("img"); // Image
        img.src = btn.src;
        img.alt = btn.alt;
        img.setAttribute("onclick", btn.onclick); // Set the onclick event
        if (btn.id) img.id = btn.id; // Changes the status of the music


        const text = document.createElement("span"); // Text
        text.textContent = btn.txtContent;
        text.style.color = "white";
        text.style.fontSize = "1.2rem";
        text.setAttribute("onclick", btn.onclick); // Set the onclick event

        wrapper.appendChild(img);
        wrapper.appendChild(text);
        container.appendChild(wrapper); // Add the image with the text to the container
    });

    popupContent.appendChild(container); // Add each container to the popupContent
    popup.style.display = "flex";
};


// Update saved level and reload the game grid
function nextLevel() {
    currentLevelIndex++; // Add 1 to the level index

    if (currentLevelIndex >= Levels.length) { // If the level index is bigger than the number of levels then it defaults to 0
        currentLevelIndex = 0;
    }

    localStorage.setItem("selectedLevel", currentLevelIndex); // Saves to in the localStorage the new level index

    currentLevel = Levels[currentLevelIndex]; // Reload the level
    userPosition = { row: 0, col: 0 };
    getUserPosition(); // Saves the charachter's position
    initialGoalPositions = getGoalPositions();
    updateLevelGrid();
    fillGrid();
    closePopup();
    resetGame();

};

// Displays an overlay congratulating the player for completing a level
function NextLevelOverlay() {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");
    const fireworks = document.getElementById("fireworks");

    document.getElementById("titleOverlay").textContent = "You did it !!!";

    popupContent.innerHTML = ""; // Clears previous content

    const buttons = [];

    if (currentLevelIndex < Levels.length - 1) { // If there are more levels, show "Next Level" button
        buttons.push({ src: "images/logo/Play.png", alt: "next level button", onclick: "nextLevel()", txtContent: "Next Level" });
    }

    // Standard buttons for resetting the game or returning to index.html
    buttons.push(
        { src: "images/logo/Repeat-Right.png", alt: "reset button", onclick: "resetGame()", txtContent: "Reset game" },
        { src: "images/logo/Home.png", alt: "homepage button", onclick: "window.location.href='index.html';", txtContent: "Home" }
    );

    const container = document.createElement("div");
    container.id = "options";

    buttons.forEach(btn => {
        const wrapper = document.createElement("div"); // Creates a wrapper element to contain the button's text and image
        wrapper.className = "optionHover";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "20px";

        const img = document.createElement("img"); // Image element
        img.src = btn.src;
        img.alt = btn.alt;
        img.setAttribute("onclick", btn.onclick);

        const text = document.createElement("span"); // Text element
        text.textContent = btn.txtContent;
        text.style.color = "white";
        text.style.fontSize = "1.2rem";
        text.setAttribute("onclick", btn.onclick);

        wrapper.appendChild(img);
        wrapper.appendChild(text);
        container.appendChild(wrapper); // Adds the wrapper elements to the container
    });

    popupContent.appendChild(container);  // Add the container to the popupContent
    popup.style.display = "flex";

    // Displays fireworks effect if available
    if (fireworks) {
        fireworks.style.display = "block";
    }
}

// Displays a popup that lets the player choose a level to play
function LevelsStatus() {
    // Get references to the popup and its content
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    document.getElementById("titleOverlay").textContent = "Choose a level !";

    popupContent.innerHTML = '';

    const levelsContainer = document.createElement("div"); // Create a container for levels
    levelsContainer.className = "levels-container";

    // Loop through available levels, which are 5
    for (var i = 1; i <= 5; i++) {
        const levelBox = document.createElement("div");
        levelBox.className = "level-box";
        levelBox.textContent = "Level " + i; // Set text for the level button

        // Add a click event to each level box to select the level
        levelBox.addEventListener("click", () => {
            closePopup();
            currentLevelIndex = i - 1; // Update the level index with the one chosen by the user

            // Save selected level index to localStorage 
            localStorage.setItem("selectedLevel", currentLevelIndex);
        });

        // Add the level box to the 'levelsContainer'
        levelsContainer.appendChild(levelBox);
    }

    // Append the levels container to the popup content
    popupContent.appendChild(levelsContainer);
    popup.style.display = "flex";
}

// Toggles background music on or off when the player clicks the music button
function toggleMusic() {
    // Get the music audio element and music toggle button
    const musicAudio = document.getElementById("audioMusic");
    const musicImage = document.getElementById("musicToggle");

    // Check the current state of the music button image
    if (musicImage.src.includes("Music-On.png")) { // If music is on, turn it off
        musicImage.src = "images/logo/Music-Off.png";
        musicImage.alt = "Music is OFF";
        musicAudio.pause() // Pause the audio
        localStorage.setItem("musicState", "off"); // Store the state
    } else { // Otherwise, turn it on
        musicImage.src = "images/logo/Music-On.png";
        musicImage.alt = "Music is ON";
        musicAudio.play() // Play the audio
        localStorage.setItem("musicState", "on"); // Store the state
    }
}

// Closes the popup when clicking outside of it
window.addEventListener("click", (event) => {
    const popup = document.getElementById("popup");
    if (event.target === popup) { // Check if the click happened on the popup background
        closePopup();
    }
});

// Sets up all the elements when the window loads
window.onload = function () {
    // Get reference to the popup
    const popup = document.getElementById("popup");
    if (!popup) return;
    popup.style.display = "none"; // Hides it

    // Load saved player character from localStorage
    const savedCharacter = localStorage.getItem("selectedCharacter");
    if (savedCharacter) {
        IMAGES[3] = savedCharacter;
    } else { // If no name was found it defaults to "Female Adventurer"
        IMAGES[3] = CHARACTERS["Female Adventurer"];
    }

    // Manage background music playback based on saved in 'localStorage'
    const musicAudio = document.getElementById("audioMusic");
    var musicState = localStorage.getItem("musicState");
    if (musicAudio) { // If no preference is set or music is turned on, play music
        if (!musicState || musicState === "on") {
            musicAudio.play();
            localStorage.setItem("musicState", "on");
        } else { // Otherwise, stop music
            musicAudio.pause();
        }
    }

    // Initialize player position and game loop
    getUserPosition();
    initialGoalPositions = getGoalPositions();
    fillGrid();
    loop();

};