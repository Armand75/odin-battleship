import {Player} from './battleship';

const player = new Player("real");
const computer = new Player("computer");

document.getElementById("auto-place").addEventListener("click", () => {
    player.gameboard.createCoordinates();
    drawShips()
})