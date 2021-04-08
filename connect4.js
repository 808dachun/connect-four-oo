/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// Notes
// Constructor: Method is a special method of a calss for creating and initializing an object of that class. Using the name constructor, it auto calls our this functions. This allows us pass in new data, right now our constructor is expecting only one value (Parameter). It exists to exept data when certain data to specific objects using the this function. 

// This keword, in most cases the value of this is determined by how a function is called (runtime binding). It can't be easily be set by assighment during execution, and it may be different each time the function is called.

//Scope: The current context of exection. the context in which values and expressiona are "visible" or can be reference. If a variable or other expression is not "in the current scope," then it is unavailable for use. Scopes can also be layered in a hierarchy, so that child scopes have access to parent scopes, but not vise verca.

// Global Scopes: mean that it is a scope that is accessible from all other scopes. 

// Instance varibales get created and initialized using constructor. Instance variables are nothing but called propert of the object. Methods are again function which attached with instand and all instances created from the same class will have those methors or actions. 

// getElementByUD() returns an Element object representihgn the element whose id properly matches the specified string. Since the element IDs are requred to be uinque if specified, they're useful way to get access to specfic element quicly. 

// array.from a static mehtos creates a new, shallow-copied Array instance from an array like or iterable object. 


class Game {
  constructor(p1, p2, height = 6, width = 7){
    this.players = [p1,p2]
    this.height = 6;
    this.width= 7;
    this.currPlayer = 1; // active player: 1 or 2
    this.makeBoard ();
    this.makeHtmlBoard ();
    this.gameOver = false;
  }



/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

makeBoard() {
  this.board = [];
  for (let y = 0; y < this.height; y++) {
    this.board.push(Array.from({ length: this.width}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');

 // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);

    top.addEventListener("click", this.handleGameClick);
    
// This makes the main part of the board
  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol(x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.style.backgroundColor = this.currPlayer.color;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

endGame(msg) {
  alert(msg);
  const top = document.querySelector("column-top");
  top.removeEventListener("click", this.handleGameClick);
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y, x);
  
  // check for win
  if (this.checkForWin()) {
    this.gameOver = true;
    return this.endGame(`The ${this.currPlayer.color} player won!`);
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }
    
  // switch players
  this.currPlayer =
    this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
  const _win = (cells) =>
    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
}

// Creating Player Class which interacts with p1 and p2 inputs.

class Player {
  constructor (color) {
    this.color = color 
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1,p2);
});

