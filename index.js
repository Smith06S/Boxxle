// take the levels from 'level.js'
import { Levels } from './level.js';

// constant that takes all the images
const IMAGES = {
    0: 'images/background/pattern_62.png',
    1: 'images/background/pattern_19.png',
    2: 'images/target/square/generic_button_square_fill.png',
    3: 'images/characters/Female_adventurer/character_femaleAdventurer_idle.png',
    4: 'images/target/cercle/generic_button_circle_fill.png',
    5: 'images/target/square/generic_button_square_outline.png'
};

const gameboard = document.getElementById('gameboard'); // game grid
const currentLevel = Levels[0] // takes the first level to start 
const userPosition = { row: 0, col: 0 }; // takes the position of the user

// implements the grid
function fillGrid() {
    gameboard.innerHTML = "";
    for (var row of currentLevel) {
        for (var cell of row) {
            const grid = document.createElement('div');

            grid.style.width = '4vw';
            grid.style.height = '4vw';
            grid.style.backgroundSize = 'cover';
            grid.style.backgroundImage = `url(${IMAGES[cell]})`;

            gameboard.appendChild(grid);
        }
    }
}

// takes the position of the user in the grid 
function getUserPosition(){
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] == 0) {
                userPosition.row = row
                userPosition.col = col
                fillGrid();
                return;
            } 
        }
    }
}

// moves the user depending on wich arrow he presses
window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 37: 
            userPosition.col -= 1;
            break;
        case 38:
            userPosition.row -= 1;
            break;
        case 39: 
            userPosition.col += 1;
            break;
        case 40: 
            userPosition.row += 1;
            break;
    }
});

// 
function loop() {
    fillGrid();  
    requestAnimationFrame(loop); 
}

fillGrid();
loop();



