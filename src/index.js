import {Player} from './battleship.js';
import "./styles.css";

const player = new Player("real");
const computer = new Player("computer");

let compCoords = [];

document.getElementById("auto-place").addEventListener("click", () => {
    player.gameboard.createCoordinates();
    createBoard(playerBoard);
    drawShips(player.gameboard.coordinates);
})

const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");

createBoard(playerBoard);
createBoard(computerBoard, true)



function createBoard(boardElement, isComputer = false){
    boardElement.textContent = ""
    for(let y = 0; y < 10; y++){
        for(let x = 0; x < 10; x++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;

            if(isComputer){
                cell.addEventListener("click", () => {
                    handlePlayerAttack(x, y);
                })
            }
            boardElement.appendChild(cell);
        }
    }
}

function handlePlayerAttack(x, y){
    const coord = [x, y];
    const gameboard = computer.gameboard;

    if(gameboard.isCoordTaken(x, y, gameboard.coordinates)) {
        gameboard.receiveAttack(coord);
        drawHit(x, y, true);
    }else{
        gameboard.receiveAttack(coord);
        drawMiss(x,y, true);
    }

    if (computer.gameboard.allSunk()){
        showMessage("You win!");
        return;
    }
    setTimeout(() => {
        const [cx, cy] = getRandomCoord();
        console.log([cx, cy])
        player.gameboard.receiveAttack([cx, cy]);
    
        if(player.gameboard.isCoordTaken(cx, cy, player.gameboard.coordinates)){
            drawHit(cx, cy, false)
        }else{
            drawMiss(cx, cy, false)
        }
    
        if(player.gameboard.allSunk()){
            showMessage("Computer wins!")
        }
    }, 500);
}

function drawShips(coords){

    coords.forEach(([x, y]) => {
        const index = y * 10 + x;
        const cell = document.querySelector(`#player-board .cell:nth-child(${index + 1})`)
        if (cell) cell.classList.add("ship");
    })
}

function drawHit(x, y, isComputerBoard){
    const boardId = isComputerBoard ? "computer-board" : "player-board";
    const index = y * 10 + x;
    const cell = document.querySelector(`#${boardId} .cell:nth-child(${index + 1})`);
    cell.classList.add("hit");
}

function drawMiss(x, y, isComputerBoard){
    const boardId = isComputerBoard ? "computer-board" : "player-board";
    const index = y * 10 + x;
    const cell = document.querySelector(`#${boardId} .cell:nth-child(${index + 1})`)
    cell.classList.add("miss");
}

function showMessage(msg){
    document.getElementById("status").textContent = msg;
}

function getRandomCoord(){
    let attempts = 0
    let randNum1;
    let randNum2;

    while(1){
        attempts++;
    randNum1 = Math.floor(Math.random() * 10);
    randNum2 = Math.floor(Math.random() * 10);

    if(!player.gameboard.isCoordTaken(randNum1, randNum2, compCoords)){
        break
    }

    if(attempts === 1000) break
}
    return [randNum1, randNum2];
}