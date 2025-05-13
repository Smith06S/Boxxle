import { Levels } from './level.js';

const IMAGES = {
    0: 'images/background/pattern_62.png',
    1: 'images/background/pattern_19.png',
    2: 'images/target/square/generic_button_square_fill.png',
    3: 'images/characters/Female_adventurer/character_femaleAdventurer_idle.png',
    4: 'images/target/cercle/generic_button_circle_fill.png',
    5: 'images/target/square/generic_button_square_outline.png'
};

const CHARACTERS = {
    "Female Adventurer": 'images/characters/Female_adventurer/character_femaleAdventurer_idle.png',
    "Male Adventurer": 'images/characters/Male_adventurer/character_maleAdventurer_idle.png',
    "Female Person": 'images/characters/Female_person/character_femalePerson_idle.png',
    "Male Person": 'images/characters/Male_person/character_malePerson_idle.png',
    "Robot": 'images/characters/Robot/character_robot_idle.png',
    "Zombie": 'images/characters/Zombie/character_zombie_idle.png',
};

var perso = "Female Adventurer"; // Default character
var mvNbr = 0;
var gameboard = document.getElementById('gameboard');

const savedLevelIndex = localStorage.getItem("selectedLevel");
var currentLevelIndex = savedLevelIndex !== null ? parseInt(savedLevelIndex) : 0;
var currentLevel = Levels[currentLevelIndex];


var userPosition = { row: 0, col: 0 }; 
var initialGoalPositions = getGoalPositions(); 

function getUserPosition() {
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 3) { 
                userPosition.row = row;
                userPosition.col = col;
                return;
            }
        }
    }
}

function getGoalPositions() {
    const goalPositions = [];

    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 4) { 
                goalPositions.push({ row, col });
            }
        }
    }

    return goalPositions;
}

function updateLevelGrid() {
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 3) {
                var isGoal = false;

                for (var pos of initialGoalPositions) {
                    if (pos.row == row && pos.col == col) {
                        isGoal = true;
                        break; 
                    }
                }

                if (isGoal) {
                    currentLevel[row][col] = 4;
                } else {
                    currentLevel[row][col] = 0;
                }
            }
        }
    }
    
    currentLevel[userPosition.row][userPosition.col] = 3; 
}


/*function fillGrid() {
    if (!gameboard) return;
    gameboard.innerHTML = "";

    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            const grid = document.createElement('div');

            grid.style.width = '4vw';
            grid.style.height = '4vw';
            grid.style.backgroundSize = 'cover';
            grid.style.backgroundImage = `url(${IMAGES[currentLevel[row][col]]})`;

            gameboard.appendChild(grid);
        }
    }
}*/

function fillGrid() {
    if (!gameboard) return;
    gameboard.innerHTML = "";

    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            const grid = document.createElement('div');
            grid.style.width = '4vw';
            grid.style.height = '4vw';
            grid.style.backgroundSize = 'cover';

            const cellValue = currentLevel[row][col];

            // 🔽 Se è il personaggio, usa il path corretto (non solo IMAGES[3])
            if (cellValue === 3) {
                let characterImage = localStorage.getItem("selectedCharacter");
                if (!characterImage) {
                    characterImage = CHARACTERS["Female Adventurer"];
                }
                grid.style.backgroundImage = `url(${characterImage})`;
            } else {
                grid.style.backgroundImage = `url(${IMAGES[cellValue]})`;
            }

            gameboard.appendChild(grid);
        }
    }
}


window.addEventListener('keydown', function (event) {
    var newRow = userPosition.row;
    var newCol = userPosition.col;
    var nextRow = userPosition.row;
    var nextCol = userPosition.col;

    switch (event.keyCode) {
        case 37: // Left
            if (newCol > 0) newCol -= 1;
            mvNbr += 1
            nextCol -= 2; 
            break;
        case 38: // Up
            if (newRow > 0) newRow -= 1;
            mvNbr += 1
            nextRow -= 2;
            break;
        case 39: // Right
            if (newCol < currentLevel[0].length - 1) newCol += 1;
            mvNbr += 1
            nextCol += 2;
            break;
        case 40: // Down
            if (newRow < currentLevel.length - 1) newRow += 1;
            mvNbr += 1
            nextRow += 2;
            break;
    }

    document.getElementById('mvNbr').textContent = "Moves: " + mvNbr;

    if (currentLevel[newRow][newCol] == 0 || currentLevel[newRow][newCol] == 4) {
        userPosition.row = newRow;
        userPosition.col = newCol;
    }
    else if (currentLevel[newRow][newCol] == 2 || currentLevel[newRow][newCol] == 5) {
        if (currentLevel[nextRow][nextCol] == 0) {
            currentLevel[newRow][newCol] = 0;
            currentLevel[nextRow][nextCol] = 2;

            userPosition.row = newRow;
            userPosition.col = newCol;
        }
        else if (currentLevel[nextRow][nextCol] == 4) {
            currentLevel[newRow][newCol] = 0;
            currentLevel[nextRow][nextCol] = 5;

            userPosition.row = newRow;
            userPosition.col = newCol;
        }

        
    }

    updateLevelGrid(); 
    fillGrid(); 
});

function loop() {
    fillGrid();
    requestAnimationFrame(loop);
}

getUserPosition()
fillGrid();
loop();

window.resetGame = function () {
    location.reload(); 
};


window.openPopup = function (infoText) {
    const popup = document.getElementById("popup");
    if (!popup) return;
    popup.style.display = "flex";
    document.getElementById("popupText").textContent = infoText; 
}

window.closePopup = function () {
    document.getElementById("popup").style.display = "none";
};


window.newPlayer = function () {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    popupContent.innerHTML = ''; // Clear previous content

    const characterContainer = document.createElement("div");
    characterContainer.className = "character-container";

    // Loop through the CHARACTERS object
    Object.entries(CHARACTERS).forEach(([name, imagePath]) => {
        const box = document.createElement("div");
        box.className = "character-box";

        const img = document.createElement("img");
        img.src = imagePath;
        img.alt = name;
        img.style.width = "100%";  // Ensure images fill the box

        // When a character is clicked
        box.addEventListener("click", () => {
    perso = name;
    localStorage.setItem("selectedCharacter", CHARACTERS[perso]); // Save image URL
    IMAGES[3] = CHARACTERS[perso]; // Update character image in grid
    console.log('the new perso is ' + perso);
    closePopup();
    fillGrid(); // 🔄 Ricarica la griglia con la nuova immagine
});


        box.appendChild(img);
        characterContainer.appendChild(box);
    });

    popupContent.appendChild(characterContainer);
    popup.style.display = "flex";
};

/*
window.LevelsStatus = function () {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    popupContent.innerHTML = ''; // Clear previous content

    const levelsContainer = document.createElement("div");
    levelsContainer.className = "levels-container";

    for (let i = 1; i <= 5; i++) { // Looping from Level 1 to Level 9
        const levelBox = document.createElement("div");
        levelBox.className = "level-box";
        levelBox.textContent = "Level " + i; // Display "Level 1", "Level 2", etc.

        levelBox.addEventListener("click", () => {
            closePopup();
            // Update currentLevelIndex with the clicked level (adjust for 0-based index)
            currentLevelIndex = i - 1; // Convert to 0-indexed
            console.log("Level " + i + " selected"); // Optional: log the selected level
        });

        levelsContainer.appendChild(levelBox);
    }

    popupContent.appendChild(levelsContainer);
    popup.style.display = "flex"; // Show the popup
}
*/

window.LevelsStatus = function () {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");

    popupContent.innerHTML = ''; // Clear previous content

    const levelsContainer = document.createElement("div");
    levelsContainer.className = "levels-container";

    for (let i = 1; i <= 5; i++) {
        const levelBox = document.createElement("div");
        levelBox.className = "level-box";
        levelBox.textContent = "Level " + i;

        levelBox.addEventListener("click", () => {
            closePopup();
            currentLevelIndex = i - 1;

            // 🔽 🔽 AGGIUNTA: salva livello nel localStorage
            localStorage.setItem("selectedLevel", currentLevelIndex);

            console.log("Level " + i + " selected");
        });

        levelsContainer.appendChild(levelBox);
    }

    popupContent.appendChild(levelsContainer);
    popup.style.display = "flex";
}

window.toggleMusic = function () {
    const musicImage = document.getElementById("musicToggle");

    if (musicImage.src.includes("Music-On.png")) {
        musicImage.src = "images/logo/logo-type-2/white/Music-Off.png";
        musicImage.alt = "Music is OFF";
        localStorage.setItem("musicState", "off"); 
        console.log('music off')
    } else {
        musicImage.src = "images/logo/logo-type-2/white/Music-On.png";
        musicImage.alt = "Music is ON";
        localStorage.setItem("musicState", "on"); 
        console.log('music on')
    }
}

window.addEventListener("click", (event) => {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        closePopup();
    }
});



window.onload = function() {
    const popup = document.getElementById("popup");
    if (!popup) return;
    popup.style.display = "none";

    const savedCharacter = localStorage.getItem("selectedCharacter");
    if (savedCharacter) {
        IMAGES[3] = savedCharacter;
        console.log("Loaded saved character:", savedCharacter);
    } else {
        IMAGES[3] = CHARACTERS["Female Adventurer"]; // Default fallback
        console.log("No saved character, using default.");
    }
};