(function (){
    'use strict';

    function GameService(){

        // Initialize the game squares
        this.init = function(n, numMines) {
            this.gameOver = false;
            this.n = n; // dimensions of board
            this.grid = []; // squares on a board
            this.uncovered = [];

            // Create Squares
            for (var i = 0; i < this.n; i++){
                this.grid.push([]);
                for (var j = 0; j < this.n; j ++){
                    this.grid[i].push(new Square(i, j, 0));
                }
            }

            this.generateMines(numMines);
            this.createUncovered();
        };

        this.newGame = function(){
            this.init(15, 30);
        };

        // Randomly generate mines
        this.generateMines = function(numMines){
            this.mines = [];
            var i = 0;

            while (i < numMines){
                var row = Math.floor(Math.random() * this.n),
                    col = Math.floor(Math.random() * this.n);

                // If the current square is not currently a mine, make it one
                if (!this.grid[row][col].mine){
                    this.grid[row][col].val = 'x';
                    this.grid[row][col].mine = true;
                    this.mines.push(this.grid[row][col]);
                    this.updateNeighbors(row, col);
                    i++;
                }
            }
        };

        // Push all uncovered Squares to array (no mines :])
        this.createUncovered = function(){
            for (var i = 0; i < this.n; i++){
                for (var j = 0; j < this.n; j++){
                    if (!this.grid[i][j].mine){
                        this.uncovered.push(this.grid[i][j]);
                    }
                }
            }
        };

        // Increase the values of neighbors surrounding the Square at [row][col] by 1
        this.updateNeighbors = function(row, col){
            var neighbors = this.getNeighbors(row, col);

            for (var i = 0; i < neighbors.length; i++){
                if (!neighbors[i].mine){
                    neighbors[i].val++;
                }
            }
        };

        // Retrieve all 8 adjacent neighbors for given row, col
        this.getNeighbors = function(row, col){
            var neighbors = [];

            // North
            if (row > 0){
                neighbors.push(this.grid[row - 1][col]);
                // NE
                if (col < (this.n - 1)){
                    neighbors.push(this.grid[row - 1][col + 1]);
                }
                // NW
                if (col > 0){
                    neighbors.push(this.grid[row - 1][col - 1]);
                }
            }
            // South
            if (row < (this.n - 1)){
                neighbors.push(this.grid[row + 1][col]);

                // SE
                if (col < (this.n - 1)){
                    neighbors.push(this.grid[row + 1][col + 1]);
                }

                // SW
                if (col > 0){
                    neighbors.push(this.grid[row + 1][col - 1]);
                }
            }
            // East
            if (col < (this.n - 1)){
                neighbors.push(this.grid[row][col + 1]);
            }
            // West
            if (col > 0){
                neighbors.push(this.grid[row][col - 1]);
            }

            return neighbors;
        };

        // Get the value of a given square, return -1 if the square is a mine
        this.getSquareValue = function(row,  col){
            var square = this.grid[row][col];
            square.visited = true;

            if (!square.mine){
                if (square.val === 0){
                    this.uncoverSquare(row, col);
                }
                else{
                    this.removeSquare(square);
                }

                return square.val;
            }
            else {
                this.removeSquare(square);
                this.gameOver = true;
                return -1;
            }
        };

        // When a user picks an empty square, uncover adjacent squares using BFS
        this.uncoverSquare = function(row, col){
            var unvisited = [],
                start = this.grid[row][col],
                self = this;


            start.visited = true;
            self.removeSquare(start);

            var neighbors = this.getNeighbors(start.row, start.col);

            for (var i = 0; i < neighbors.length; i++){
                if (!neighbors[i].visited){
                    unvisited.push(neighbors[i]);
                }
            }

            while (unvisited.length > 0){
                var square = unvisited.shift();

                if (!square.mine){
                    self.removeSquare(square);

                    // Empty square
                    if (square.val === 0){
                        neighbors = self.getNeighbors(square.row, square.col);

                        for (var i = 0; i < neighbors.length; i++){
                            if (!neighbors[i].visited && !neighbors[i].mine){
                                unvisited.push(neighbors[i]);
                                neighbors[i].visited = true;
                            }
                        }
                    }
                }
            }
        };

        // Remove a square from this.uncovered (sets are in es6 only :()
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

        // Object representation of each square on the grid
        function Square(row, col, val){
            this.row = row;
            this.col = col;
            this.val = val; // value of square is 0-8,
            this.mine = false;
            this.visited = false;
        }


        this.init(15, 30);
    }

    function GameServiceFactory() {
        return new GameService();
    }

    angular
    .module('minesweeper')
    .factory('GameService', GameServiceFactory);
})();
