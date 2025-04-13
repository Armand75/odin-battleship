class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.coordinates = [];
  }

  hit() {
    if (!this.sunk) {
      this.hits++;
      this.isSunk();
    }
  }
  isSunk() {
    if (this.length <= this.hits) {
      this.sunk = true;
    }
  }
}

class Gameboard {
  constructor() {
    this.shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    this.ships = [];
    this.coordinates = [];
    this.missed = [];
    this.hits = [];
    this.buildShips();
    this.createCoordinates();

  }
  buildShips() {
    this.shipSizes.forEach((size) => {
      const ship = new Ship(size);
      this.ships.push(ship);
    });
  }

  createCoordinates() {
    this.coordinates = [];
    this.ships.forEach((ship) => {
      ship.coordinates = [];
      let randNum1 = 0;
      let randNum2 = 0;
      let factor = 0;
      let attempts = 0

      outer: while (1) {
        attempts++;
        if(attempts === 1000) break;

        randNum1 = Math.floor(Math.random() * 10);
        randNum2 = Math.floor(Math.random() * 10);


        if (!this.isCoordTaken(randNum1, randNum2, this.coordinates)) {
          for (let i = 0; i < ship.length; i++) {
            if (this.isCoordTaken(randNum1 + i, randNum2, this.coordinates)) {
              break;
            }

            if (randNum1 > 9 || randNum1 < 0 || randNum2 > 9 || randNum2 < 0) {
              break;
            }

            if (i + 1 === ship.length) {
              break outer;
            }
          }
          for (let i = 0; i < ship.length; i++) {
            if (this.isCoordTaken(randNum1, randNum2 + i, this.coordinates)) {
              break;
            }
            if (randNum1 > 9 || randNum1 < 0 || randNum2 > 9 || randNum2 < 0) {
              break;
            }

            if (i + 1 === ship.length) {
              factor = 1;
              break outer;
            }
          }
          
        }
      }
      for (let i = 0; i < ship.length; i++) {
        if (factor === 0) {
          ship.coordinates.push([randNum1 + i, randNum2]);
          this.coordinates.push([randNum1 + i, randNum2]);
        }
        if (factor === 1) {
          ship.coordinates.push([randNum1, randNum2 + i]);
          this.coordinates.push([randNum1, randNum2 + i]);
        }
      }
    });
  }
  receiveAttack(array) {
    if (this.isCoordTaken(array[0], array[1], this.coordinates)) {
      this.ships.forEach((ship) => {
        if (this.isCoordTaken(array[0], array[1], ship.coordinates)) {
          ship.hit();
          this.hits.push(array);
        }
      });
    } else {
      this.missed.push(array);
    }
  }

  allSunk(){
    return this.ships.every(ship => ship.sunk === true)
  }

  isCoordTaken(x, y, array){
    return array.some(coord => coord[0] === x && coord[1] === y)
  }
}

export class Player{
    constructor (type){
        this.type = type;
        this.gameboard = new Gameboard();
    }
}

// module.exports = {Ship, Gameboard, Player};
