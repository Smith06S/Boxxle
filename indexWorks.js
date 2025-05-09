import { Levels } from './level.js';

const TILE_IMAGES = {
    0: 'images/background/pattern_62.png', 
    1: 'images/background/pattern_19.png', 
    2: 'images/target/square/generic_button_square_fill.png', 
    3: 'images/characters/Female_adventurer/character_femaleAdventurer_idle.png', 
    4: 'images/target/cercle/generic_button_circle_fill.png', 
    '2on4': 'images/target/square/generic_button_square_outline.png' 
};

const gameboard = document.getElementById('gameboard');

// da riscrivere
function deepCopyLevel(level) {
    return level.map(row => [...row]); 
}

const originalLevel = deepCopyLevel(Levels[1]);
var currentLevel = deepCopyLevel(Levels[1]);

var playerPosition = { row: 0, col: 0, underTile: 0 };

// da riscrivere
function findPlayerPosition() {
    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            if (currentLevel[row][col] === 3) { 
                const originalTile = originalLevel[row][col];
                playerPosition = {
                    row,  
                    col,   
                    underTile: originalTile === 4 ? 4 : 0 
                };
                return;
            }
        }
    }
}

// da riscrivere
function render() {
    gameboard.innerHTML = '';  

    for (var row = 0; row < currentLevel.length; row++) {
        for (var col = 0; col < currentLevel[row].length; col++) {
            const tile = document.createElement('div'); 
            const tileValue = currentLevel[row][col];   
            const baseTile = originalLevel[row][col];  

            tile.style.width = '4vw';
            tile.style.height = '4vw';
            tile.style.backgroundSize = 'cover'; 

            if (tileValue === 2 && baseTile === 4) {
                tile.style.backgroundImage = `url(${TILE_IMAGES['2on4']})`;  
            } else if (TILE_IMAGES.hasOwnProperty(tileValue)) {
                tile.style.backgroundImage = `url(${TILE_IMAGES[tileValue]})`;  
            }

            gameboard.appendChild(tile);
        }
    }
}

//
function resetLevel() {
    currentLevel = deepCopyLevel(originalLevel);  
    findPlayerPosition();  
    render();  
}
window.resetLevel = resetLevel;  

window.addEventListener('keydown', function(event) {
    
    const directions = {
        37: { row: 0, col: -1 }, 
        38: { row: -1, col: 0 },
        39: { row: 0, col: 1 }, 
        40: { row: 1, col: 0 }   
    };

    const move = directions[event.keyCode];  
    if (!move) return;  

    const { row, col, underTile } = playerPosition;  
    const newRow = row + move.row; 
    const newCol = col + move.col;  

    if (
        newRow < 0 || newRow >= currentLevel.length ||
        newCol < 0 || newCol >= currentLevel[0].length
    ) return;

    const nextTile = currentLevel[newRow][newCol];  

    if (nextTile === 0 || nextTile === 4) {
        currentLevel[row][col] = underTile;  
        playerPosition.underTile = originalLevel[newRow][newCol] === 4 ? 4 : 0;  
        currentLevel[newRow][newCol] = 3;  
        playerPosition.row = newRow; 
        playerPosition.col = newCol;  

    } else if (nextTile === 2) {
        const boxNewRow = newRow + move.row; 
        const boxNewCol = newCol + move.col;

        if (
            boxNewRow >= 0 && boxNewRow < currentLevel.length &&
            boxNewCol >= 0 && boxNewCol < currentLevel[0].length &&
            (currentLevel[boxNewRow][boxNewCol] === 0 || currentLevel[boxNewRow][boxNewCol] === 4)
        ) {
            currentLevel[boxNewRow][boxNewCol] = 2;  
            currentLevel[row][col] = underTile;  
            playerPosition.underTile = originalLevel[newRow][newCol] === 4 ? 4 : 0;  
            currentLevel[newRow][newCol] = 3;  

            playerPosition.row = newRow;  
            playerPosition.col = newCol;  
        }
    }
});

function gameLoop() {
    render();  
    requestAnimationFrame(gameLoop); 
}

findPlayerPosition();
render();
gameLoop();
