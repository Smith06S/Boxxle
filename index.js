import { Levels } from './level.js';

const IMAGES = {
    0: 'images/background/pattern_62.png',
    1: 'images/background/pattern_19.png',
    2: 'images/target/square/generic_button_square_fill.png',
    3: 'images/characters/Female_adventurer/character_femaleAdventurer_idle.png',
    4: 'images/target/cercle/generic_button_circle_fill.png',
    5: 'images/target/square/generic_button_square_outline.png'
};

const gameboard = document.getElementById('gameboard');
const currentLevelIndex = 0
const currentLevel = Levels[currentLevelIndex] 
const userPosition = { row: 0, col: 0 }; 
const initialGoalPositions = getGoalPositions(); 

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


function fillGrid() {
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
}

window.addEventListener('keydown', function (event) {
    var newRow = userPosition.row;
    var newCol = userPosition.col;
    var nextRow = userPosition.row;
    var nextCol = userPosition.col;

    switch (event.keyCode) {
        case 37: // Left
            if (newCol > 0) newCol -= 1;
            nextCol -= 2; 
            break;
        case 38: // Up
            if (newRow > 0) newRow -= 1;
            nextRow -= 2;
            break;
        case 39: // Right
            if (newCol < currentLevel[0].length - 1) newCol += 1;
            nextCol += 2;
            break;
        case 40: // Down
            if (newRow < currentLevel.length - 1) newRow += 1;
            nextRow += 2;
            break;
    }

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
    openPopup("Create a new player profile.");
}

window.LevelsStatus = function () {
    openPopup("Choose a game level.");
}

window.toggleMusic = function () {
    const musicImage = document.getElementById("musicToggle");

    if (musicImage.src.includes("Music-On.png")) {
        musicImage.src = "images/logo/logo-type-2/white/Music-Off.png";
        musicImage.alt = "Music is OFF";
        localStorage.setItem("musicState", "off"); 
    } else {
        musicImage.src = "images/logo/logo-type-2/white/Music-On.png";
        musicImage.alt = "Music is ON";
        localStorage.setItem("musicState", "on"); 
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
};
