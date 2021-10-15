import factoryHelper from '../helpers/factoryhelper.js';

// props = { length, initialHits }
export const shipFactory = (props) => {
  const length = props.length;
  const hits = props.initialHits || [];

  const hit = (coord) => {
    if (!hits.includes(coord)) {
      hits.push(coord);
      return true;
    } else {
      return false;
    }
  }

  const isSunk = () => {
    return hits.length === length;
  }

  return {
    hit,
    isSunk,
  }
}

export const gameboardFactory = (size) => {
  let board = [];
  const initialize = (() => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        board.push({
          coord: [j, i],
          hit: 0,
          shipId: null
        })
      }
    }
  })();

  const ships = [];

  const allShipsSunk = () => {
    let sunk = true;
    ships.forEach(ship => {
      if (!ship.isSunk()) sunk = false;
    })
    return sunk;
  }

  // shipProps = { length, initialHits }
  // locationProps = { coord: [x, y], dir: ('e' || 's') }
  const placeShip = (shipProps, locationProps) => {
    let placedShipId = null;
    let placedCoords = undefined;
    try {
      placedCoords = factoryHelper.getCoordsIfOpen(
        shipProps.length, locationProps, board);
      placedShipId = ships.push(shipFactory(shipProps)) - 1;
      board = board.map(cell => {
        let newCell = cell;
        placedCoords.forEach(coord => {
          if (factoryHelper.arraysMatch(cell.coord, coord)) {
            newCell = {
              coord: coord,
              hit: 0,
              shipId: placedShipId
            };
          }
        });
        return newCell;
      });
      return true;
    } catch (e) {
      throw (e)
    }
  }

  const receiveAttack = (coord) => {
    const index = factoryHelper.getIndexFromCoord(coord, board);
    if (board[index].hit !== 0) {
      throw('already hit');
    }
    const shipId = board[index].shipId;
    if (shipId === null) {
      board[index].hit = -1;
      return false;
    } else {
      board[index].hit = 1;
      ships[shipId].hit(coord);
      return true;
    }
  }

  const getBoard = () => { return board };

  return {
    allShipsSunk,
    placeShip,
    receiveAttack,
    getBoard,
  }
}