function Sweeper(rows, cols, mines){
	"use strict";
	this.size = [rows, cols];
	this.numMines = mines;
	this.gameOver = false;
	this.grid = [];
	this.mines = [];
	this.uncovered = [];
	this.newSize = [];

	// Initialize the grid to all zeros
	this.init = function(){
		this.grid = [];

		if (this.newSize.length){
			this.size = this.newSize.copy();
		}

		for (var i = 0; i < this.size[0]; i++){
			this.grid.push([]);

			for (var j = 0; j < this.size[1]; j ++){
				this.grid[i].push(new Square(i, j, 0));
			}
		}
	};

	// Randomly generate mines in the grid
	this.generate = function(){
		var i = 0;
		this.mines = [];

		while (i < this.numMines){
			var row = Math.floor(Math.random() * this.size[0]),
				col = Math.floor(Math.random() * this.size[1]);

			// If the current square is not currently a mine, make it one
			if (isFinite(this.grid[row][col].val)){
				this.grid[row][col].setVal(Number.POSITIVE_INFINITY);
				this.updateNeighbors(row, col);
				this.mines.push(this.grid[row][col]);
				i++;
			}
		}

		this.createUncovered();
	};

	// Push all numerical spaces to uncovered tiles array
	this.createUncovered = function(){
		for (var i = 0; i < this.size[0]; i++){
			for (var j = 0; j < this.size[1]; j++){

				if (isFinite(this.grid[i][j].val)){
					this.uncovered.push(this.grid[i][j]);
				}
			}
		}
	}

	// Restart the game
	this.newGame = function(){
		this.uncovered = [];
		this.mines = [];
		this.gameOver = false;
		this.init();
		this.generate();
	}

	// Update the value of all adjacent neighbors
	// Note: mines are INFINITY therefore their value does not change
	this.updateNeighbors = function(row, col){
		var neighbors = this.getNeighbors(row, col);

		for (var i = 0; i < neighbors.length; i++){
			neighbors[i].val++;
		}
	};

	// Retrive all 8 adjacent neighbors for given row, col
	this.getNeighbors = function(row, col){
		var neighbors = [];

		// N
		if (row > 0){
			neighbors.push(this.grid[row - 1][col]);

			// NE
			if (col < (this.size[1] - 1)){
				neighbors.push(this.grid[row - 1][col + 1]);
			}

			// NW
			if (col > 0){
				neighbors.push(this.grid[row - 1][col - 1]);
			}
		}

		// S
		if (row < (this.size[0] - 1)){
			neighbors.push(this.grid[row + 1][col]);

			// SE
			if (col < (this.size[1] - 1)){
				neighbors.push(this.grid[row + 1][col + 1]);
			}

			// SW
			if (col > 0){
				neighbors.push(this.grid[row + 1][col - 1]);
			}
		}

		// E
		if (col < (this.size[1] - 1)){
			neighbors.push(this.grid[row][col + 1]);
		}

		// W
		if (col > 0){
			neighbors.push(this.grid[row][col - 1]);
		}

		return neighbors;
	};

	// Get the value of a given square, return -1 if the square is a mine
	this.get = function(row,  col){
		var square = this.grid[row][col];

		if (isFinite(square.val)){
			if (square.val === 0) this.uncover(row, col);
			else this.removeSquare(square);

			return square.val;
		}
		else {
			this.gameOver = true;
			return -1;
		}
	};

	// If user picks an empty square, uncover adjacent squares using BFS
	this.uncover = function(row, col)
	{
		var unvisited = [],
			start = this.grid[row][col],
			self = this;

		start.setVisited(true);

		self.removeSquare(start);
		var neighbors = this.getNeighbors(start.row, start.col);

		for (var i = 0; i < neighbors.length; i++){
			unvisited.push(neighbors[i]);
		}

		// A setTimeout loop is used to slow the algorithm down so it is not instantaneous.
		// Looks a little better this way.
		function loop(){
			var square = unvisited.shift();

			if (!square.visited && isFinite(square.val)){
				var $curr = $("td[data-row='" + square.row + "'][data-col='" + square.col + "']");

				$curr.removeClass("covered");
				$curr.addClass("uncovered");
				$curr.removeClass("flag");
				$curr.html('');

				self.removeSquare(square);

				// Empty square
				if (square.val === 0){
					neighbors = self.getNeighbors(square.row, square.col);

					for (var i = 0; i < neighbors.length; i++){
						unvisited.push(neighbors[i]);
					}
				}

				// Non-empty
				else{
					$curr.html(square.val);
				}

				square.setVisited(true);
			}
			if (unvisited.length > 0) setZeroTimeout(loop);
		}
		loop();
	};

	// Are there any more valid squares to uncover?
	this.goalCheck = function(){
		this.gameOver = (this.uncovered.length === 0);
		return this.gameOver;
	};

	// Remove a square from this.uncovered
	this.removeSquare = function(square){
		var remove = -1;

		for (var i = 0; i < this.uncovered.length; i++){
			if ((this.uncovered[i].row == square.row) && (this.uncovered[i].col == square.col)){
				remove = i;
				break;
			}
		}
		
		if (i !== -1){
			this.uncovered.splice(i, 1);
		}
	};

	this.getRows = function(){
		return this.size[0];
	};

	this.getCols = function(){
		return this.size[1];
	};

	this.getMines = function(){
		return this.mines;
	};

	this.addMine = function(val){
		this.numMines += val;	
		this.mineCheck();

		return this.numMines;
	};

	this.mineCheck = function(){
		var size = this.newSize.length ? this.newSize : this.size;

		if (this.numMines <= 1){
			this.numMines = 2;
		}
		else if (this.numMines >= (size[0] * size[1])){
			this.numMines = size[0] * size[1] - 1;
		}		
	}
	// Cache the updated size in a newSize variable to be used on next game
	this.updateSize = function(val){
		if (!this.newSize.length){
			this.newSize = this.size.copy();
		}
		
		this.newSize[0] = (this.newSize[0] + val) ? (this.newSize[0] + val) : 1;
		this.newSize[1] = (this.newSize[1] + val) ? (this.newSize[1] + val) : 1;

		this.mineCheck();
		return this.newSize;
	}
}

// Represents each square on the grid
function Square(row, col, val){
	this.row = row;
	this.col = col;
	this.val = val;
	this.visited = false;

	this.setVal = function(val){
		this.val = val;
	};

	this.setVisited = function(bool){
		this.visited = bool;
	};

	this.getRow = function(){
		return this.row;
	};

	this.getCol = function(){
		return this.col;
	};
}