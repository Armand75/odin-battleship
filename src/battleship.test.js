const { Ship, Gameboard } = require("./battleship");

describe("Ship", () => {
  test("Ship registers hits and sinks correctly", () => {
    const ship = new Ship(3);
    expect(ship.sunk).toBe(false);

    ship.hit();
    expect(ship.hits).toBe(1);
    expect(ship.sunk).toBe(false);

    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(3);
    expect(ship.sunk).toBe(true);
  });

  test("Ship doesn't increment hits after sinking", () => {
    const ship = new Ship(1);
    ship.hit();

    expect(ship.hits).toBe(1);
    expect(ship.sunk).toBe(true);

    ship.hit();
    expect(ship.hits).toBe(1);
  });
});

describe("Gameboard", () => {
  test("Correct number of ships and total coordinates placed", () => {
    const board = new Gameboard();
    expect(board.ships.length).toBe(10);
    console.log(board.coordinates);
    const totalCoords = board.coordinates.length;
    const expectedCoords = board.ships.reduce(
      (sum, ship) => sum + ship.length,
      0
    );

    expect(totalCoords).toBe(expectedCoords);
  });

  test("Registers a hit correctly", () => {
    const board = new Gameboard();
    const target = board.coordinates[0];

    board.receiveAttack(target);

    expect(board.hits).toContainEqual(target);

    const hitShip = board.ships.find((ship) =>
      ship.coordinates.some(
        (coord) => coord[0] === target[0] && coord[1] === target[1]
      )
    );
    expect(hitShip.hits).toBe(1);
  });

  test("Registered a miss correctly", () => {
    const board = new Gameboard();

    let missCoord;
    outer: for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!board.isCoordTaken(i, j, board.coordinates)) {
          missCoord = [i, j];
          break outer;
        }
      }
    }

    board.receiveAttack(missCoord);
    expect(board.missed).toContainEqual(missCoord);
  });

  test("allSunk returns true only when all ships are sunk", () => {
    const board = new Gameboard();

    board.ships.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        ship.hit();
      }
    });

    expect(board.allSunk()).toBe(true);
  });
});
